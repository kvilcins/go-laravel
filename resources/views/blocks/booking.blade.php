<section class="booking" id="booking">
    <div class="container">
        <h2 class="booking__title h2">Забронировать зал просто</h2>
        <form class="booking__form" action="https://jsonplaceholder.typicode.com/posts" method="POST">
            <fieldset class="booking__fieldset booking__fieldset--halls">
                <legend class="booking__legend">Выбери зал</legend>
                <div class="booking__halls">
                    <label class="booking__hall-label">
                        <input type="radio" name="hall" value="80s-vibes" class="booking__hall-input booking__hall-input--80s">
                        <span class="booking__hall-visual">80's Vibes</span>
                    </label>
                    <label class="booking__hall-label">
                        <input type="radio" name="hall" value="star-wars" class="booking__hall-input booking__hall-input--star-wars">
                        <span class="booking__hall-visual">Star Wars</span>
                    </label>
                    <label class="booking__hall-label">
                        <input type="radio" name="hall" value="wild-west" class="booking__hall-input booking__hall-input--wild-west">
                        <span class="booking__hall-visual">Wild West</span>
                    </label>
                    <label class="booking__hall-label">
                        <input type="radio" name="hall" value="neon-style" class="booking__hall-input booking__hall-input--neon-style">
                        <span class="booking__hall-visual">Neon Style</span>
                    </label>
                </div>
            </fieldset>

            <div class="booking__content">
                <fieldset class="booking__fieldset booking__fieldset--entertainment">
                    <legend class="booking__legend">Собери набор развлечений</legend>

                    <fieldset class="booking__sub-fieldset">
                        <legend class="booking__sub-legend">Приставка:</legend>
                        <div class="booking__options">
                            <label class="booking__option-label">
                                <input type="radio" name="console" value="playstation" class="booking__option-input">
                                <span class="booking__option-text">PlayStation</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="radio" name="console" value="sega" class="booking__option-input">
                                <span class="booking__option-text">Sega</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="radio" name="console" value="xbox" class="booking__option-input">
                                <span class="booking__option-text">Xbox</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="radio" name="console" value="dendy" class="booking__option-input">
                                <span class="booking__option-text">Dendy</span>
                            </label>
                        </div>
                    </fieldset>

                    <fieldset class="booking__sub-fieldset">
                        <legend class="booking__sub-legend">Настольные игры</legend>
                        <div class="booking__options">
                            <label class="booking__option-label">
                                <input type="checkbox" name="games[]" value="jenga" class="booking__option-input">
                                <span class="booking__option-text">Jenga</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="checkbox" name="games[]" value="monopoly" class="booking__option-input">
                                <span class="booking__option-text">Monopoly</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="checkbox" name="games[]" value="manchkin" class="booking__option-input">
                                <span class="booking__option-text">Munchkin</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="checkbox" name="games[]" value="alias" class="booking__option-input">
                                <span class="booking__option-text">Alias</span>
                            </label>
                        </div>
                    </fieldset>

                    <fieldset class="booking__sub-fieldset">
                        <legend class="booking__sub-legend">Дополнительно</legend>
                        <div class="booking__options">
                            <label class="booking__option-label">
                                <input type="checkbox" name="additional[]" value="karaoke" class="booking__option-input">
                                <span class="booking__option-text">Karaoke</span>
                            </label>
                            <label class="booking__option-label">
                                <input type="checkbox" name="additional[]" value="vr" class="booking__option-input">
                                <span class="booking__option-text">VR</span>
                            </label>
                        </div>
                    </fieldset>
                </fieldset>

                <fieldset class="booking__fieldset booking__fieldset--datetime">
                    <legend class="booking__legend">Выбери дату и время</legend>
                    <div class="booking__datetime">
                        <div class="booking__selects">
                            <label class="booking__select-label">
                                <select name="date" class="booking__select">
                                    <option value="">Дата</option>
                                    <option value="19.10">19.10</option>
                                    <option value="20.10">20.10</option>
                                    <option value="21.10">21.10</option>
                                    <option value="22.10">22.10</option>
                                    <option value="23.10">23.10</option>
                                    <option value="24.10">24.10</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="time" class="booking__select">
                                    <option value="">Время</option>
                                    <option value="12:00">12:00</option>
                                    <option value="12:30">12:30</option>
                                    <option value="13:00">13:00</option>
                                    <option value="13:30">13:30</option>
                                    <option value="14:00">14:00</option>
                                    <option value="14:30">14:30</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="amount" class="booking__select">
                                    <option value="">Сколько человек</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                </select>
                            </label>
                        </div>
                        <div class="booking__inputs">
                            <label class="booking__input-label">
                                <span class="booking__input-text">Имя</span>
                                <input type="text" name="first-name" required class="booking__input">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Телефон</span>
                                <input type="tel" name="phone" required pattern="^\+?[7-8]-?[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$" class="booking__input">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Фамилия</span>
                                <input type="text" name="last-name" required class="booking__input">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">E-mail</span>
                                <input type="email" name="email" class="booking__input">
                            </label>
                        </div>
                    </div>
                </fieldset>

                <button type="submit" class="booking__submit">Забронировать</button>
            </div>
        </form>
    </div>
</section>
