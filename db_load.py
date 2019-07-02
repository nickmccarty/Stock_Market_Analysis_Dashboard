import os

import pandas as pd
import numpy as np


import sqlite3
from sqlite3 import Error
import requests
from bs4 import BeautifulSoup
import datetime
# from config import NEWS_KEY,alpha_vantage_key


# Create function that connects to databse. Import into flask file to use this wjere ever a connection needed.
def connector():
    return sqlite3.connect('db/stockdata.db')


#####################################################################
''' Initalize sqlite database and load with one table named 'tickers'.
    List of symbols doesnt change. Ran once in terminal to create database.
    Table is used only for queries, not updated                   '''
#####################################################################

def init_ticktable(tablename):
    """ create a database table for tick symbols, in a database that resides
        on disk.If database doesnt exist,one is created.
    """


    # Assign csv location
    stock_csv = 'stock_list/nasdaq_tickers.csv'
    # CSV to dataframe
    stocklist_df = pd.read_csv(stock_csv)
    # Load dataframe into sqlite database in a table named 'tickers'
    stocklist_df.to_sql('{}'.format(tablename),connector(), if_exists='replace')


# if __name__ == '__main__':
    # Call function/ Create database

#init_ticktable('tickers')
# Unconment^^^^  load databse with tickerlist by running file in terminal
# If no db exist it will create one in db folder



#################################################################################
''' Function to query database table of ticker symbols. Returns a list of symbols'''
#################################################################################

def symbolFetch():

    # Create cursor
    c = connector().cursor()
    # Query for ticker symbols and names
    tick_query = c.execute('select * from tickers;')
    # Create a list of query results
    ticklist = []
    for tick in tick_query:
        ticklist.append(tick)
    # Create dataframe
    tick_df = pd.DataFrame(ticklist)
    # Drop duplicate index
    tick_df = tick_df.drop([0], axis=1)
    # Create a list of symbols from the symbols column.
    # This list is available for the flask app.
    symbols = list(tick_df[1])

    return symbols

################################################################
    ''' Function to request news data from external API '''
###############################################################
def get_articles(choice,key):
    stock_news = {
    'url': "https://api.newsriver.io/v2/search?query=text%3A",
    'symbol': choice, # this is a text string doesnt have to be only a ticker symbol.see newriver.io docs
    'sort':'discoverDate',
    'sortorder':'DESC',
    'count': '10',
    'header': {"Authorization":''}
    }

    formatted_url = "{}{}&sortBy={}&sortOrder={}&limit={}".format(stock_news['url'],stock_news["symbol"],stock_news['sort'],stock_news['sortorder'],stock_news['count'])

    response = requests.get(formatted_url, headers={"Authorization":key}).json()
    # response = [{}]
    return response
################################################################
    ''' Initialize table of news data '''
###############################################################

def init_newstable(responseitem):
    response_df= pd.DataFrame(responseitem)
    response_df = response_df.dropna(subset=['publishDate'])
    response_df = response_df[['publishDate','discoverDate','highlight','text','url']]
    response_df.to_sql('newsdata',connector(), if_exists='replace')

###################################################
''' Scrape  market overview'''
##################################################
def marketstats(tablechoice):

    url= 'https://www.nasdaq.com/markets/most-active.aspx'
    data = pd.read_html(url)
    mostactive_sharevol = data[2]
    mostactive_sharevol = mostactive_sharevol.drop(['Company.1'], axis=1).to_json(orient = 'records')
    most_declined = data[4]
    most_declined = most_declined.drop(['Company.1'], axis=1).to_json(orient = 'records')
    mostactive_dollarvol = data[5]
    mostactive_dollarvol = mostactive_dollarvol.drop(['Company.1'], axis=1).to_json(orient = 'records')
    if tablechoice == 'mostactivebyvol':
        return mostactive_sharevol
    elif tablechoice == 'mostdeclined':
        return most_declined
    else:
        return mostactive_dollarvol

###################################################
''' Scrape  Economic Calendar'''
##################################################
def scrape_econcal(date):

    url = "https://www.forexfactory.com/calendar.php?day="
    page = requests.get('{}{}'.format(url,date))
    content = page.content

    soup = BeautifulSoup(content,"html.parser")

    table = soup.find_all("tr",{"class":"calendar_row"})
    #print(table)

    forcal = []
    for item in table:
        dict = {}

        dict["Currency"] = item.find_all("td", {"class":"calendar__currency"})[0].text.strip() #Currency
        dict["Event"] = item.find_all("td",{"class":"calendar__event"})[0].text.strip() #Event Name
        dict["Time_Eastern"] = item.find_all("td", {"class":"calendar__time"})[0].text #Time Eastern
        impact = item.find_all("td", {"class":"impact"})

        for icon in range(0,len(impact)):
            dict["Impact"] = impact[icon].find_all("span")[0]['title'].split(' ', 1)[0]

        dict["Actual"] = item.find_all("td", {"class":"calendar__actual"})[0].text #Actual Value
        dict["Forecast"] = item.find_all("td", {"class":"calendar__forecast"})[0].text #forecasted Value
        dict["Previous"] = item.find_all("td", {"class":"calendar__previous"})[0].text # Previous

        forcal.append(dict)

    df = pd.DataFrame(forcal)

    df = df[["Currency","Event", "Impact","Time_Eastern", "Actual","Forecast", "Previous"]]
    df = df.to_json(orient = 'records')

    return df

#####################################################################
''' Pull data from AlphaVantage for short term price action plot'''
####################################################################

def stock_call(choice,key):
    type_of_pull = "full"
    # type_of_pull = "compact"
    alphaVBase = "https://www.alphavantage.co/query?"
    alphaVInterday1 = "function=TIME_SERIES_INTRADAY&symbol="
    alphaVInterday2 = "&interval=5min&outputsize=full&apikey="
    alpha_vantage_url = alphaVBase + alphaVInterday1 + choice + alphaVInterday2 + key
    stock_response = requests.get(alpha_vantage_url).json()

    return stock_response
