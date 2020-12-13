#coding:utf-8
import json, urllib2, time

url = 'https://api.tokyometroapp.jp/api/v2/datapoints?rdf:type=odpt:Train&odpt:railway=odpt.Railway:TokyoMetro.MarunouchiBranch&acl:consumerKey=cc66ea238085a6851d9efac3ab639b4313b14d1d8f0684bc53bbac3207be0239'
r = urllib2.urlopen(url)
print(r.read())