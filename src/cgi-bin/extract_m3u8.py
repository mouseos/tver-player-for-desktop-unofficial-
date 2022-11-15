#!/usr/bin/python 
# -*- coding: utf-8 -*- 
import cgi
import sqlite3
import sys
import io
import subprocess
def extract_m3u8(url,url_type):
	if(url_type=="yt-dlp"):
		return(subprocess.run('yt-dlp -g '+url, shell=True, stdout=subprocess.PIPE, check=True).stdout)
		
# 日本語を受信時にエラーにならないようにする為に必要。
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
 
form = cgi.FieldStorage()
 
# 入力チェック（必要な変数が送信されていない場合はエラー。）
if 'url' not in form:
    print('Content-type: text/html; charset=UTF-8')
    print('')
    print('url が送信されていません。')
    sys.exit()
# your_name の値を取得して変数にセット。
# 値が入力されていない場合は「匿名」を設定。
# your_name が複数ある場合は先頭の値を取得。
url = form.getfirst('url', '')
 
# テキストファイルとして内容を出力
print('Content-type: text/html; charset=UTF-8')
print('')
print(str(extract_m3u8(url,"yt-dlp").decode())) 
