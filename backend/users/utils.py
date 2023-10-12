import csv
from datetime import datetime, date
from django.http import HttpResponse
from django.db.models import Q
from .models import (
                        FishGameTrial, 
                        RankedQualities, 
                        TreeShakingGameTrial, 
                        Profile, 
                        IndividualRankingQualitiesScore, 
                        PurchaseHistory,
                        DynamicPromptResponse,
                        ParticipantResponse,
                        Question,
                    )



def export_fishgame_trials_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = FishGameTrial.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"fish_game_data_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
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

export_fishgame_trials_csv.short_description = 'Export fish game trials as CSV'


def export_treeshaking_trials_csv(request, queryset=None, modeladmin=None):

    if queryset is None:
        queryset = TreeShakingGameTrial.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"tree_shaking_data_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
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
        participant_data = {
            'participantID': participant_id if participant_id else original_participant_id,
            'sessionID': session_id,
            'stakesType': stakes_type,
        }

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

        participant_trials = queryset.filter(
            Q(participant__id=participant_id, session_id=session_id) |
            Q(original_participant_id=original_participant_id, session_id=session_id)
        ).order_by('trial_number')

        for trial in participant_trials:
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

export_treeshaking_trials_csv.short_description = 'Export tree-shaking game trials as CSV'


def export_rankedqualities_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = RankedQualities.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"Voice_your_values_data_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    writer = csv.writer(response)

    quality_choices = dict(RankedQualities.quality_choices)
    category_choices = dict(RankedQualities.category_choices)

    header = ['participant', 'session_id', 'created_at']

    for category_key, category_label in category_choices.items():
        for quality_key, quality_label in quality_choices.items():
            header.append(f'{category_label} - {quality_label}')

    writer.writerow(header)

    participant_rankings = {}

    for ranked_quality in queryset:
        participant_id = ranked_quality.participant_id if ranked_quality.participant else ranked_quality.original_participant_id
        quality = quality_choices[ranked_quality.quality]
        category = category_choices[ranked_quality.category]
        rank = ranked_quality.rank
        session_id = ranked_quality.session_id
        created_at = ranked_quality.created_at.strftime("%Y-%m-%d %H:%M:%S")

        if participant_id not in participant_rankings:
            if ranked_quality.participant:
                participant_id = ranked_quality.participant.id
            participant_rankings[participant_id] = {
                'participant': participant_id,
                'data_by_session': {}
            }

        if session_id not in participant_rankings[participant_id]['data_by_session']:
            participant_rankings[participant_id]['data_by_session'][session_id] = {
                'session_id': session_id,
                'created_at': created_at,
                'rankings': {}
            }

        participant_rankings[participant_id]['data_by_session'][session_id]['rankings'][category] = \
            participant_rankings[participant_id]['data_by_session'][session_id]['rankings'].get(category, {})
        participant_rankings[participant_id]['data_by_session'][session_id]['rankings'][category][quality] = rank

    for participant_id, participant_data in participant_rankings.items():
        for session_id, session_data in participant_data['data_by_session'].items():
            data_row = [participant_id, session_id, session_data['created_at']]
            rankings = session_data['rankings']

            for category_key, category_label in category_choices.items():
                for quality_key, quality_label in quality_choices.items():
                    rank = rankings.get(category_label, {}).get(quality_label, '')
                    data_row.append(rank)

            writer.writerow(data_row)

    return response

export_rankedqualities_csv.short_description = 'Export Voice Your Values Ranking as CSV'



def export_scores_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = IndividualRankingQualitiesScore.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"Voice_your_Values_Ranking_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    writer = csv.writer(response)

    unique_questions = set()
    for score in queryset:
        if score.question:
            unique_questions.add(score.question.question_text)
        if score.original_question_text:
            unique_questions.add(score.original_question_text)

    tell_us_about_you_questions = list(unique_questions)

    header = ['participant', 'session_id', 'created_at']
    header.extend(tell_us_about_you_questions)
    writer.writerow(header)

    participant_data = {}

    for score in queryset:
        participant_id = score.participant_id if score.participant else score.original_participant_id
        question_text = score.question.question_text if score.question else score.original_question_text
        score_value = score.score
        session_id = score.session_id
        created_at = score.created_at.strftime("%Y-%m-%d %H:%M:%S")

        if participant_id not in participant_data:
            participant_data[participant_id] = {'session_id': session_id, 'created_at': created_at}

        if not question_text or question_text not in tell_us_about_you_questions:
            question_text = score.original_question_text

        if question_text:
            if session_id != participant_data[participant_id]['session_id']:
                participant_data[participant_id] = {'session_id': session_id, 'created_at': created_at}
            participant_data[participant_id][question_text] = score_value

    for participant_id, data in participant_data.items():
        row = [participant_id, data['session_id'], data['created_at']]
        for question in tell_us_about_you_questions:
            row.append(data.get(question, ''))
        writer.writerow(row)

    return response

export_scores_csv.short_description = 'Export Voice Your Values Ratings as CSV'


def calculate_age(birth_month, birth_year):
    current_date = date.today()
    
    if birth_year is None:
        return None
    
    age = current_date.year - birth_year
    if current_date.month < birth_month:
        age -= 1
    return age

def export_profile_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = Profile.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"user_profiles_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    writer = csv.writer(response)

    header = ['participant', 'age', 'nationality', 'gender', 'zipcode', 'created_at']
    writer.writerow(header)

    for profile in queryset:
        participant = profile.participant_id
        birth_month = profile.birth_month
        birth_year = profile.birth_year
        age = calculate_age(birth_month, birth_year)
        nationality = profile.nationality
        gender = profile.gender
        zipcode = profile.zipcode
        created_at = profile.created_at
        writer.writerow([participant, age if age is not None else '', nationality, gender, zipcode, created_at])

    return response

export_profile_csv.short_description = 'Export User Profile data as CSV'


def export_purchase_history_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = PurchaseHistory.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"purchase_history_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
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


def export_dynamic_prompt_responses_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = DynamicPromptResponse.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"dynamic_prompt_responses_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    writer = csv.writer(response)

    session_data = {}

    for dynamic_prompt_response in queryset:
        participant_id = dynamic_prompt_response.participant_id
        if participant_id is None:
            participant_id = dynamic_prompt_response.original_participant_id

        session_id = dynamic_prompt_response.session_id

        key = (session_id, participant_id)

        if key not in session_data:
            session_data[key] = {
                'session_id': session_id,
                'participant_id': participant_id,
                'created_at': dynamic_prompt_response.created_at,  
                'activity_name': '',
                'prompts': {},
            }

        prompt_text = dynamic_prompt_response.dynamic_prompt.prompt_text
        prompt_index = len(session_data[key]['prompts']) + 1

        session_data[key]['prompts'][f'prompt-{prompt_index}'] = prompt_text

        if not session_data[key]['activity_name']:
            session_data[key]['activity_name'] = dynamic_prompt_response.activity.activity_type

    all_prompts = set()
    for data in session_data.values():
        all_prompts.update(data['prompts'].keys())

    sorted_prompts = sorted(all_prompts, key=lambda x: int(x.split('-')[1]))

    header = ['session_id', 'participant_id', 'created_at', 'activity_name'] + sorted_prompts
    writer.writerow(header)

    for key, data in session_data.items():
        session_id, participant_id = key
        row = [session_id, participant_id, data['created_at'], data['activity_name']]
        row.extend(data['prompts'].get(prompt, '') for prompt in sorted_prompts)
        writer.writerow(row)

    return response

export_dynamic_prompt_responses_csv.short_description = 'Export Dynamic Prompt Responses as CSV'


def export_participant_responses_csv(request, queryset=None, modeladmin=None):
    if queryset is None:
        queryset = ParticipantResponse.objects.all()

    current_datetime = datetime.now().strftime('%m%d%Y-%H%M')

    file_name = f"participant_responses_{current_datetime}.csv"

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{file_name}"'
    writer = csv.writer(response)

    session_data = {}

    for participant_response in queryset:
        participant_id = participant_response.participant_id
        if participant_id is None:
            participant_id = participant_response.original_participant_id

        session_id = participant_response.session_id

        key = (session_id, participant_id)

        if key not in session_data:
            session_data[key] = {
                'session_id': session_id, 
                'participant_id': participant_id,
                'created_at': participant_response.created_at, 
                'activity_type': '', 
                'questions': []
            }

        if not session_data[key]['activity_type']:
            session_data[key]['activity_type'] = participant_response.activity_feedback.activity_type

        question_data = {
            'question-text': participant_response.question.question_text if participant_response.question else participant_response.original_question_text,
            'question-type': participant_response.question.question_type if participant_response.question else participant_response.original_question_type,
            'answer': None
        }

        if question_data['question-type'] == 'text_input':
            question_data['answer'] = participant_response.text_answer
        elif question_data['question-type'] in ['dropdown', 'multiple_choice']:
            if participant_response.question:
                answer_options = participant_response.answer_options.all()
                if answer_options:
                    question_data['answer'] = ', '.join(option.option_text for option in answer_options)
            else:
                question_data['answer'] = participant_response.original_answer_options

        session_data[key]['questions'].append(question_data)

    max_questions = max(len(info['questions']) for info in session_data.values())

    header = ['session_id', 'participant_id', 'created_at', 'activity_type'] 
    for i in range(1, max_questions + 1):
        header.extend([
            f'question-text-{i}',
            f'question-type-{i}',
            f'answer-{i}'
        ])

    writer.writerow(header)

    for session_key, session_info in session_data.items():
        row = [session_info['session_id'], session_info['participant_id'], session_info['created_at'], session_info['activity_type']]  # Moved 'session_id' before 'participant_id'
        for question_data in session_info['questions']:
            row.extend([question_data['question-text'], question_data['question-type'], question_data['answer']])
        writer.writerow(row)

    return response

export_participant_responses_csv.short_description = 'Export Participant Responses as CSV'
