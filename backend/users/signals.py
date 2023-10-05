from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import (
                        User, 
                        FishGameTrial, 
                        ParticipantResponse, 
                        RankedQualities, 
                        TreeShakingGameTrial, 
                        IndividualRankingQualitiesScore, 
                        Question,
                        PurchaseHistory,
                        DynamicPromptResponse,
                    )



@receiver(pre_delete, sender=User)
def user_pre_delete_handler(sender, instance, **kwargs):
    fish_trials = FishGameTrial.objects.filter(participant=instance)
    participant_responses = ParticipantResponse.objects.filter(participant=instance)
    ranked_qualities = RankedQualities.objects.filter(participant=instance)
    treeshaking_trials = TreeShakingGameTrial.objects.filter(participant=instance)
    ranking_scores = IndividualRankingQualitiesScore.objects.filter(participant=instance)
    purchase_histories = PurchaseHistory.objects.filter(participant=instance)
    dynamic_prompt_responses = DynamicPromptResponse.objects.filter(participant=instance)

    for trial in fish_trials:
        trial.original_participant_id = trial.participant_id
        trial.save()

    for response in participant_responses:
        response.original_participant_id = response.participant_id
        response.save()

    for quality in ranked_qualities:
        quality.original_participant_id = quality.participant_id
        quality.save()

    for trial in treeshaking_trials:
        trial.original_participant_id = trial.participant_id
        trial.save()

    for score in ranking_scores:
        score.original_participant_id = score.participant_id
        score.save()    
    
    for history in purchase_histories:
        history.original_participant_id = history.participant_id
        history.save()

    for response in dynamic_prompt_responses:
        response.original_participant_id = response.participant_id
        response.save()


@receiver(pre_delete, sender=Question)
def question_pre_delete_handler(sender, instance, **kwargs):
    related_responses = ParticipantResponse.objects.filter(question=instance)
    ranking_scores = IndividualRankingQualitiesScore.objects.filter(question=instance)

    for response in related_responses:
        response.original_question_text = instance.question_text
        response.save()

    for score in ranking_scores:
        score.original_question_text = instance.question_text
        score.save()

    