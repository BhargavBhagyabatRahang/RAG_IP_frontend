from django.db import models


class ChatSession(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)  # user / assistant
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)