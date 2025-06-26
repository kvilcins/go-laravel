<section class="booking" id="booking">
    <div class="container">
        <h2 class="booking__title">Забронировать зал просто</h2>
        <form class="booking__form form" action="https://jsonplaceholder.typicode.com/posts" method="POST">
            <fieldset class="form__fieldset fieldset-halls">
                <legend class="fieldset-halls__legend">Выбери зал</legend>
                <fieldset class="fieldset-halls__inner-fieldset rooms">
                    <label class="rooms__label">
                        <input type="radio" name="hall" value="80s-vibes" lang="en" class="rooms__input rooms__input--80s">
                    </label>
                    <label class="rooms__label">
                        <input type="radio" name="hall" value="star-wars" lang="en" class="rooms__input rooms__input--star-wars">
                    </label>
                    <label class="rooms__label">
                        <input type="radio" name="hall" value="wild-west" lang="en" class="rooms__input rooms__input--wild-west">
                    </label>
                    <label class="rooms__label">
                        <input type="radio" name="hall" value="neon-style" lang="en" class="rooms__input rooms__input--neon-style">
                    </label>
                </fieldset>
            </fieldset>
            <div class="width-limiting">
                <fieldset class="width-limiting__fieldset fieldset-entertainment">
                    <legend class="fieldset-entertainment__legend">Собери набор развлечений</legend>
                    <fieldset class="fieldset-entertainment__inner-fieldset consoles">
                        <legend class="consoles__legend">Приставка:</legend>
                        <label class="consoles__label">
                            <input type="radio" name="console" value="playstation" lang="en" class="consoles__input">
                            Playstation
                        </label>
                        <label class="consoles__label">
                            <input type="radio" name="console" value="sega" lang="en" class="consoles__input">
                            Sega
                        </label>
                        <label class="consoles__label">
                            <input type="radio" name="console" value="xbox" lang="en" class="consoles__input">
                            Xbox
                        </label>
                        <label class="consoles__label">
                            <input type="radio" name="console" value="dendy" lang="en" class="consoles__input">
                            Dendy
                        </label>
                    </fieldset>
                    <fieldset class="fieldset-entertainment__inner-fieldset board-games">
                        <legend class="board-games__legend">Настольные игры</legend>
                        <label class="board-games__label">
                            <input type="checkbox" name="games" value="jenga" lang="en" class="board-games__input">
                            Jenga
                        </label>
                        <label class="board-games__label">
                            <input type="checkbox" name="games" value="monopoly" lang="en" class="board-games__input">
                            Monopoly
                        </label>
                        <label class="board-games__label">
                            <input type="checkbox" name="games" value="manchkin" lang="en" class="board-games__input">
                            Manchkin
                        </label>
                        <label class="board-games__label">
                            <input type="checkbox" name="games" value="alias" lang="en" class="board-games__input">
                            Alias
                        </label>
                    </fieldset>
                    <fieldset class="fieldset-entertainment__inner-fieldset additional">
                        <legend class="additional__legend">Дополнительно</legend>
                        <label class="additional__label">
                            <input type="checkbox" name="additional" value="karaoke" class="additional__input">
                            Karaoke
                        </label>
                        <label class="additional__label">
                            <input type="checkbox" name="additional" value="vr" class="additional__input">
                            Vr
                        </label>
                    </fieldset>
                </fieldset>
                <fieldset class="width-limiting__fieldset date">
                    <legend class="date__legend">Выбери дату и время</legend>
                    <div class="date__wrap date-left">
                        <label class="date-left__label">
                            <select name="date" class="date-left__select date-left__select--date">
                                <option value="Дата">Дата</option>
                                <option value="19.10">19.10</option>
                                <option value="20.10">20.10</option>
                                <option value="21.10">21.10</option>
                                <option value="22.10">22.10</option>
                                <option value="23.10">23.10</option>
                                <option value="24.10">24.10</option>
                            </select>
                        </label>
                        <label class="date-left__label">
                            <select name="time" class="date-left__select date-left__select--time">
                                <option value="Время">Время</option>
                                <option value="12:00">12:00</option>
                                <option value="12:30">12:30</option>
                                <option value="13:00">13:00</option>
                                <option value="13:30">13:30</option>
                                <option value="14:00">14:00</option>
                                <option value="14:30">14:30</option>
                            </select>
                        </label>
                        <label class="date-left__label date-left__label--amount">
                            <select name="amount" class="date-left__select-amount">
                                <option value="Сколько человек">Сколько человек</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                            </select>
                        </label>
                    </div>
                    <div class="date__wrap date-right">
                        <label class="date-right__label">
                            Имя
                            <input type="text" name="first-name" required class="date-right__input date-right__input--firstname">
                        </label>
                        <label class="date-right__label">
                            Телефон
                            <input type="tel" name="phone" required pattern="^\+?[7-8]-?[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$" class="date-right__input date-right__input--phone">
                        </label>
                        <label class="date-right__label">
                            Фамилия
                            <input type="text" name="last-name" required class="date-right__input date-right__input--lastname">
                        </label>
                        <label class="date-right__label">
                            E-mail
                            <input type="email" name="email" class="date-right__input date-right__input--email">
                        </label>
                    </div>
                </fieldset>
                <button type="submit" class="width-limiting__button">Забронировать</button>
            </div>
        </form>
    </div>
</section>
