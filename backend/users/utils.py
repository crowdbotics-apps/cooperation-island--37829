import csv
import datetime
from django.http import HttpResponse
from django.db.models import Q
from .models import (
                        FishGameTrial, 
                        RankedQualities, 
                        TreeShakingGameTrial, 
                        Profile, 
                        IndividualRankingQualitiesScore, 
                        ActivityFeedback,
                        PurchaseHistory
                    )




def export_fishgame_trials_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = FishGameTrial.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="fishgametrials.csv"'

    writer = csv.writer(response)

    trials = FishGameTrial.objects.values_list('trial_number', flat=True).distinct().order_by('trial_number')

    header = ['participantID', 'sessionID', 'stakesType', 'stakesMin', 'stakesMax']
    for trial_number in trials:
        header.extend([
            f'trial{trial_number}_timestamp',
            f'trial{trial_number}_numberDisplayed',
            f'trial{trial_number}_incentive',
            f'trial{trial_number}_participantShells',
            f'trial{trial_number}_response',
            f'trial{trial_number}_responsetime'
        ])

    writer.writerow(header)

    participants_sessions = queryset.values_list('participant__id', 'original_participant_id', 'session_id').distinct().order_by('participant__id', 'session_id')

    for participant_id, original_participant_id, session_id in participants_sessions:
        if participant_id:
            participant_data = {
                'participantID': participant_id,
                'sessionID': session_id,
            }
        elif original_participant_id:
            participant_data = {
                'participantID': original_participant_id,
                'sessionID': session_id,
            }
        else:
            continue  

        participant_trials = queryset.filter(Q(participant__id=participant_id) | Q(original_participant_id=original_participant_id), session_id=session_id).order_by('trial_number')

        if participant_trials.exists():
            participant_data['stakesType'] = participant_trials[0].stakes_type
            participant_data['stakesMin'] = participant_trials[0].stakes_min
            participant_data['stakesMax'] = participant_trials[0].stakes_max

        trial_data = {}
        for trial_number in range(1, 25):
            trial_data[trial_number] = {
                'timestamp': '',
                'numberDisplayed': '',
                'incentive': '',
                'participantShells': '',
                'response': '',
                'responsetime': ''
            }

        for trial in participant_trials:
            trial_number = trial.trial_number
            trial_data[trial_number]['timestamp'] = trial.created_at
            trial_data[trial_number]['numberDisplayed'] = trial.number
            trial_data[trial_number]['incentive'] = trial.shell
            trial_data[trial_number]['participantShells'] = trial.participant_shell
            trial_data[trial_number]['response'] = 'match' if trial.match else 'nomatch'
            trial_data[trial_number]['responsetime'] = trial.trial_response_time

        data_row = [participant_data['participantID'], participant_data['sessionID']]
        if participant_data.get('stakesType'):
            data_row.extend([participant_data['stakesType'], participant_data['stakesMin'], participant_data['stakesMax']])
        else:
            data_row.extend(['', '', ''])

        for trial_number in range(1, 25):
            trial_info = trial_data[trial_number]
            data_row.extend([trial_info['timestamp'], trial_info['numberDisplayed'], trial_info['incentive'],
                             trial_info['participantShells'], trial_info['response'], trial_info['responsetime']])
        
        writer.writerow(data_row)

    return response

export_fishgame_trials_csv.short_description = 'Export selected trials as CSV'


def export_treeshaking_trials_csv(request, queryset=None, modeladmin=None):

    if queryset is None:
        queryset = TreeShakingGameTrial.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="treeshakinggametrials.csv"'

    writer = csv.writer(response)

    header = ['participantID', 'sessionID', 'stakesType']
    trials = TreeShakingGameTrial.objects.values_list('trial_number', flat=True).distinct().order_by('trial_number')
    
    for trial_number in trials:
        header.extend([
            f'trial{trial_number}_timestamp',
            f'trial{trial_number}_numberDisplayed',
            f'trial{trial_number}_divisionType',
            f'trial{trial_number}_denominator',
            f'trial{trial_number}_selfDistribution',
            f'trial{trial_number}_partnerDistribution',
            f'trial{trial_number}_participantShells',
            f'trial{trial_number}_answer',
            f'trial{trial_number}_responsetime'
        ])

    writer.writerow(header)

    participants_sessions = queryset.values_list('participant__id', 'original_participant_id', 'session_id', 'stakes_type').distinct().order_by('participant__id', 'session_id')

    for participant_id, original_participant_id, session_id, stakes_type in participants_sessions:
        if participant_id:
            participant_data = {
                'participantID': participant_id,
                'sessionID': session_id,
                'stakesType': stakes_type,
            }
        elif original_participant_id:
            participant_data = {
                'participantID': original_participant_id,
                'sessionID': session_id,
                'stakesType': stakes_type,
            }
        else:
            continue 

        trial_data = {}
        for trial_number in range(1, 25):
            trial_data[trial_number] = {
                'timestamp': '',
                'numberDisplayed': '',
                'divisionType': '',
                'denominator': '',
                'selfDistribution': '',
                'partnerDistribution': '',
                'participantShells': '',
                'answer': '',
                'responsetime': ''
            }

        for trial in queryset.filter(participant__id=participant_id, session_id=session_id).order_by('trial_number'):
            trial_number = trial.trial_number
            trial_data[trial_number]['timestamp'] = trial.created_at
            trial_data[trial_number]['numberDisplayed'] = trial.trial_number
            trial_data[trial_number]['denominator'] = trial.shell
            trial_data[trial_number]['selfDistribution'] = trial.shell - trial.shared_shell
            trial_data[trial_number]['partnerDistribution'] = trial.shared_shell
            trial_data[trial_number]['participantShells'] = trial.participant_shell
            trial_data[trial_number]['answer'] = 'accept' if trial.response else 'reject'
            trial_data[trial_number]['responsetime'] = trial.trial_response_time

            ratio = trial.shared_shell / (trial.shell / 2)
            if ratio == 1:
                trial_data[trial_number]['divisionType'] = 'equal'
            elif ratio < 1:
                trial_data[trial_number]['divisionType'] = 'unequal_adv'
            elif ratio > 1:
                trial_data[trial_number]['divisionType'] = 'unequal_disadv'

        data_row = [participant_data['participantID'], participant_data['sessionID'], participant_data['stakesType']]

        for trial_number in range(1, 25):
            trial_info = trial_data[trial_number]
            data_row.extend([
                trial_info['timestamp'],
                trial_info['numberDisplayed'],
                trial_info['divisionType'],
                trial_info['denominator'],
                trial_info['selfDistribution'],
                trial_info['partnerDistribution'],
                trial_info['participantShells'],
                trial_info['answer'],
                trial_info['responsetime']
            ])

        writer.writerow(data_row)

    return response

export_treeshaking_trials_csv.short_description = 'Export selected trials as CSV'



def export_rankedqualities_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = RankedQualities.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="rankedqualities.csv"'

    writer = csv.writer(response)

    quality_choices = dict(RankedQualities.quality_choices)
    category_choices = dict(RankedQualities.category_choices)

    header = ['participant']
    for category in category_choices.values():
        for quality in quality_choices.values():
            header.append(f'{category} - {quality}')
    writer.writerow(header)

    participant_rankings = {}

    for ranked_quality in queryset:
        participant_id = ranked_quality.participant_id if ranked_quality.participant else ranked_quality.original_participant_id
        quality = quality_choices[ranked_quality.quality]
        category = category_choices[ranked_quality.category]
        rank = ranked_quality.rank

        if participant_id not in participant_rankings:
            if ranked_quality.participant:
                participant_id = ranked_quality.participant.id
            participant_rankings[participant_id] = {
                'participant': participant_id,
            }

        if category not in participant_rankings[participant_id]:
            participant_rankings[participant_id][category] = {}

        participant_rankings[participant_id][category][quality] = rank

    for participant_id, participant_data in participant_rankings.items():
        data_row = [participant_data['participant']]
        for category in category_choices.values():
            for quality in quality_choices.values():
                rank = participant_data.get(category, {}).get(quality, '')
                data_row.append(rank)
        writer.writerow(data_row)

    return response

export_rankedqualities_csv.short_description = 'Export selected trials as CSV'


def export_scores_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = IndividualRankingQualitiesScore.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="individual_ranking_qualities_scores.csv"'

    writer = csv.writer(response)

    unique_questions = set()
    for score in queryset:
        if score.question:
            unique_questions.add(score.question.question_text)
        if score.original_question_text:
            unique_questions.add(score.original_question_text)

    tell_us_about_you_questions = list(unique_questions)

    header = ['participant']
    header.extend(tell_us_about_you_questions)
    writer.writerow(header)

    participant_data = {}

    for score in queryset:
        participant_id = score.participant_id if score.participant else score.original_participant_id
        question_text = score.question.question_text if score.question else score.original_question_text
        score_value = score.score

        if participant_id not in participant_data:
            participant_data[participant_id] = {}

        if not question_text or question_text not in tell_us_about_you_questions:
            question_text = score.original_question_text  # Get question_text from original_question_text

        if question_text:
            participant_data[participant_id][question_text] = score_value

    for participant_id, data in participant_data.items():
        row = [participant_id]
        for question in tell_us_about_you_questions:
            row.append(data.get(question, ''))
        writer.writerow(row)

    return response


export_scores_csv.short_description = 'Export selected trials as CSV'


def calculate_age(birth_month, birth_year):
    current_date = datetime.date.today()
    
    if birth_year is None:
        return None
    
    age = current_date.year - birth_year
    if current_date.month < birth_month:
        age -= 1
    return age

def export_profile_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = Profile.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="profiles.csv"'

    writer = csv.writer(response)

    header = ['participant', 'age', 'nationality', 'gender', 'zipcode']
    writer.writerow(header)

    for profile in queryset:
        participant = profile.participant.username
        birth_month = profile.birth_month
        birth_year = profile.birth_year
        age = calculate_age(birth_month, birth_year)
        nationality = profile.nationality
        gender = profile.gender
        zipcode = profile.zipcode
        writer.writerow([participant, age if age is not None else '', nationality, gender, zipcode])

import csv

def export_purchase_history_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = PurchaseHistory.objects.all()

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="purchase_history.csv"'

    writer = csv.writer(response)

    header = ['participantID']
    for i in range(1, 10):
        header.extend([
            f'purchase{i}_timestamp',
            f'purchase{i}_choice',
            f'purchase{i}_cost',
            f'purchase{i}_participantShells'
        ])
    writer.writerow(header)

    participant_data = {}

    for purchase in queryset.order_by('participant_id', 'purchased_at'):
        participant_id = purchase.participant_id if purchase.participant else purchase.original_participant_id

        if participant_id:
            if participant_id not in participant_data:
                participant_data[participant_id] = []

            purchase_data = [
                purchase.purchased_at,
                purchase.theme_purchased.name,
                purchase.purchase_cost,
                purchase.participant_shell_at_purchase
            ]
            participant_data[participant_id].append(purchase_data)

    for participant_id, purchases in participant_data.items():
        data_row = [participant_id]

        for i in range(1, 10):
            if i <= len(purchases):
                purchase_data = purchases[i - 1]
                data_row.extend([
                    purchase_data[0],  # purchase{i}_timestamp
                    purchase_data[1],  # purchase{i}_choice
                    purchase_data[2],  # purchase{i}_cost
                    purchase_data[3],  # purchase{i}_participantShells
                ])
            else:
                # Empty values for missing purchases
                data_row.extend(['', '', '', ''])

        writer.writerow(data_row)

    return response

export_purchase_history_csv.short_description = 'Export Purchase History as CSV'


