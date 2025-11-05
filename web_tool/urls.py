from django.urls import path
from . import views

urlpatterns = [
    # 相簿頁面（主要 UI 頁）→ 顯示 gallery.html
    path('', views.gallery_view, name="gallery"),
    # JSON API → 回傳圖片網址清單
    path('photos.json', views.photos_manifest, name="photos"),
    # 測試頁
    path('hello/', views.hello_world, name="hello"),
]