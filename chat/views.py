import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatSession,ChatMessage
from IP_frontend.settings import LLM_URL

import json
import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatSession, ChatMessage


import json
import requests
from django.shortcuts import render
from django.http import JsonResponse
from .models import ChatSession, ChatMessage


def chat_view(request):
    session = ChatSession.objects.create()
    return render(request, "chat.html", {"session_id": session.id})


def send_message(request):
    if request.method == "POST":
        data = json.loads(request.body)

        session_id = data.get("session_id")
        user_message = data.get("message")

        session = ChatSession.objects.get(id=session_id)

        ChatMessage.objects.create(
            session=session,
            role="user",
            content=user_message
        )

        messages = ChatMessage.objects.filter(
            session=session
        ).order_by("created_at")[:10]

        formatted_messages = [
            {"role": m.role, "content": m.content}
            for m in messages
        ]

        response = requests.post(
            LLM_URL,
            json={
                "query": user_message,
                "history": formatted_messages
            }
        )

        answer = response.json()["answer"]

        ChatMessage.objects.create(
            session=session,
            role="assistant",
            content=answer
        )

        return JsonResponse({"answer": answer})