<section class="booking" id="booking">
    <div class="container">
        <h2 class="booking__title h2">Забронировать зал просто</h2>
        <form class="booking__form" method="POST" action="{{ route('booking.submit') }}">
            @csrf
            <fieldset class="booking__fieldset booking__fieldset--halls">
                <legend class="booking__legend">Выбери зал</legend>
                <div class="booking__halls">
                    @foreach($rooms as $room)
                        <label class="booking__hall-label">
                            <input
                                type="radio"
                                name="room_id"
                                value="{{ $room['id'] }}"
                                class="booking__hall-input booking__hall-input--{{ Str::slug($room['slug']) }}"
                            >
                            <span class="booking__hall-visual">{{ $room['label'] }}</span>
                        </label>
                    @endforeach
                </div>
            </fieldset>

            <div class="booking__content">
                <fieldset class="booking__fieldset booking__fieldset--entertainment">
                    <legend class="booking__legend">Собери набор развлечений</legend>

                    @if(isset($entertainments['console']))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Приставка:</legend>
                            <div class="booking__options">
                                @foreach($entertainments['console'] as $console)
                                    <label class="booking__option-label">
                                        <input type="radio" name="console" value="{{ strtolower($console) }}" class="booking__option-input">
                                        <span class="booking__option-text">{{ $console }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif

                    @if(isset($entertainments['board_games']))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Настольные игры</legend>
                            <div class="booking__options">
                                @foreach($entertainments['board_games'] as $game)
                                    <label class="booking__option-label">
                                        <input type="checkbox" name="games[]" value="{{ strtolower($game) }}" class="booking__option-input">
                                        <span class="booking__option-text">{{ $game }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif

                    @if(isset($entertainments['additional']))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Дополнительно</legend>
                            <div class="booking__options">
                                @foreach($entertainments['additional'] as $additional)
                                    <label class="booking__option-label">
                                        <input type="checkbox" name="additional[]" value="{{ strtolower($additional) }}" class="booking__option-input">
                                        <span class="booking__option-text">{{ $additional }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif
                </fieldset>

                <fieldset class="booking__fieldset booking__fieldset--datetime">
                    <legend class="booking__legend">Выбери дату и время</legend>
                    <div class="booking__datetime">
                        <div class="booking__selects">
                            <label class="booking__select-label">
                                <select name="date" class="booking__select">
                                    <option value="">Дата</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="time_slot_id" class="booking__select" disabled>
                                    <option value="">Сначала выберите дату и зал</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="amount" class="booking__select">
                                    <option value="">Сколько человек</option>
                                    @for($i = 2; $i <= 10; $i++)
                                        <option value="{{ $i }}">{{ $i }}</option>
                                    @endfor
                                </select>
                            </label>
                        </div>
                        <div class="booking__inputs">
                            <label class="booking__input-label">
                                <span class="booking__input-text">Имя</span>
                                <input type="text" name="first_name" required class="booking__input" value="{{ old('first_name') }}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Телефон</span>
                                <input type="tel" name="phone" required pattern="^\+?[7-8]-?[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}$" class="booking__input" value="{{ old('phone') }}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Фамилия</span>
                                <input type="text" name="last_name" required class="booking__input" value="{{ old('last_name') }}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">E-mail</span>
                                <input type="email" name="email" class="booking__input" value="{{ old('email') }}">
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div class="booking__availability-info" style="display: none;">
                    <p class="booking__availability-text"></p>
                </div>

                <button type="submit" class="booking__submit">Забронировать</button>
            </div>
        </form>
    </div>
</section>
