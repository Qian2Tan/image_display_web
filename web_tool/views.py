from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime
from django.http import JsonResponse
from django.conf import settings
import os

def index(request):
    return HttpResponse("Web Tool works!")

def hello_world(request):
    time = datetime.now()
    return render(request, 'hello.html', locals())

def photos_manifest(request):
    # 圖片資料夾路徑 (實體路徑)
    folder = os.path.join(settings.BASE_DIR, "static", "images", "gallery")

    # 允許的圖片類型
    exts = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif')

    # 掃描圖片
    files = sorted([
        f for f in os.listdir(folder)
        if f.lower().endswith(exts)
    ])

    # 產生圖片 URL
    urls = [f"/static/images/gallery/{f}" for f in files]

    return JsonResponse(urls, safe=False)

def gallery_view(request):
    return render(request, 'gallery.html')
