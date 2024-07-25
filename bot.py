import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

API_TOKEN = '7232358936:AAERMepJMoG4VK245YvSRnF5e5ZXZUSQis8'

logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)

# URL вашей игры, опубликованной на GitHub Pages или другом хостинге
GAME_URL = "https://your-username.github.io/your-repository-name/"

@dp.message_handler(commands=['start', 'play'])
async def send_welcome(message: types.Message):
    keyboard = InlineKeyboardMarkup()
    play_button = InlineKeyboardButton(text="Play Flappy Bird", url=GAME_URL)
    keyboard.add(play_button)
    await message.answer("Click the button below to play Flappy Bird!", reply_markup=keyboard)

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
    