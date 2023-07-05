import csv
from django.http import HttpResponse
from .models import FishGameTrial


def export_trials_csv(request, queryset=None, modeladmin=None):

    if queryset is None:
        queryset = FishGameTrial.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fishgametrials.csv"'

    writer = csv.writer(response)

    participants = queryset.values_list('participant__id', flat=True).distinct()
    trials = FishGameTrial.objects.values_list('trial_number', flat=True).distinct().order_by('trial_number')

    # Create header row
    header = ['participantID']
    for trial_number in trials:
        header.append(f'trial{trial_number}_number')
        header.append(f'trial{trial_number}_response')
        header.append(f'trial{trial_number}_responsetime')
    writer.writerow(header)

    # Collect trial responses for each participant
    participant_responses = {}

    for participant_id in participants:
        participant_responses[participant_id] = {
            'participantID': participant_id,
        }

    for trial in queryset:
        participant_id = trial.participant.id
        trial_number = trial.trial_number

        # Update trial response for the participant
        if trial_number not in participant_responses[participant_id]:
            participant_responses[participant_id][trial_number] = {
                'number': trial_number,
                'response': 'match' if trial.match else 'nomatch',
                'responsetime': trial.trial_response_time,
            }

    # Write data rows
    for participant_id, participant_data in participant_responses.items():
        data_row = [participant_data['participantID']]
        for trial_number in trials:
            trial_data = participant_data.get(trial_number)
            if trial_data:
                data_row.append(trial_data['number'])
                data_row.append(trial_data['response'])
                data_row.append(trial_data['responsetime'])
            else:
                data_row.append('')
                data_row.append('')
                data_row.append('')
        writer.writerow(data_row)

    return response

export_trials_csv.short_description = 'Export selected trials as CSV'