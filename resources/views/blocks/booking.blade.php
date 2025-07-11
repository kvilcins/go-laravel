<meta name="csrf-token" content="{!! csrf_token() !!}">
<section class="booking" data-scroll-target="booking">
    <div class="container">
        <h2 class="booking__title h2">Book a room easily</h2>

        <form class="booking__form" method="POST" action="{!! route('booking.submit') !!}" novalidate>
            @csrf
            <fieldset class="booking__fieldset booking__fieldset--halls">
                <legend class="booking__legend">Choose room</legend>
                <div class="booking__halls">
                    @foreach($rooms as $room)
                        <label class="booking__hall-label">
                            <input
                                type="radio"
                                name="room_id"
                                value="{!! get_data($room, 'id') !!}"
                                class="booking__hall-input booking__hall-input--{!! Str::slug(get_data($room, 'slug')) !!}"
                            >
                            <span class="booking__hall-visual">{!! get_data($room, 'label') !!}</span>
                        </label>
                    @endforeach
                </div>
            </fieldset>

            <div class="booking__content">
                <fieldset class="booking__fieldset booking__fieldset--entertainment">
                    <legend class="booking__legend">Choose entertainment package</legend>

                    @if(has_data($entertainments, 'console'))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Console:</legend>
                            <div class="booking__options">
                                @foreach(get_data($entertainments, 'console', []) as $console)
                                    <label class="booking__option-label">
                                        <input type="radio" name="console" value="{!! strtolower($console) !!}" class="booking__option-input">
                                        <span class="booking__option-text">{!! $console !!}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif

                    @if(has_data($entertainments, 'board_games'))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Board games</legend>
                            <div class="booking__options">
                                @foreach(get_data($entertainments, 'board_games', []) as $game)
                                    <label class="booking__option-label">
                                        <input type="checkbox" name="games[]" value="{!! strtolower($game) !!}" class="booking__option-input">
                                        <span class="booking__option-text">{!! $game !!}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif

                    @if(has_data($entertainments, 'additional'))
                        <fieldset class="booking__sub-fieldset">
                            <legend class="booking__sub-legend">Additional</legend>
                            <div class="booking__options">
                                @foreach(get_data($entertainments, 'additional', []) as $additional)
                                    <label class="booking__option-label">
                                        <input type="checkbox" name="additional[]" value="{!! strtolower($additional) !!}" class="booking__option-input">
                                        <span class="booking__option-text">{!! $additional !!}</span>
                                    </label>
                                @endforeach
                            </div>
                        </fieldset>
                    @endif
                </fieldset>

                <fieldset class="booking__fieldset booking__fieldset--datetime">
                    <legend class="booking__legend">Choose date and time</legend>
                    <div class="booking__datetime">
                        <div class="booking__selects">
                            <label class="booking__select-label">
                                <select name="date" class="booking__select">
                                    <option value="">Date</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="time_slot_id" class="booking__select" disabled>
                                    <option value="">First select date and room</option>
                                </select>
                            </label>
                            <label class="booking__select-label">
                                <select name="amount" class="booking__select">
                                    <option value="">How many people</option>
                                    @for($i = 2; $i <= 10; $i++)
                                        <option value="{!! $i !!}">{!! $i !!}</option>
                                    @endfor
                                </select>
                            </label>
                        </div>
                        <div class="booking__inputs">
                            <label class="booking__input-label">
                                <span class="booking__input-text">First Name</span>
                                <input type="text" name="first_name" class="booking__input" value="{!! old('first_name') !!}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Phone</span>
                                <input type="tel" name="phone" class="booking__input" value="{!! old('phone') !!}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">Last Name</span>
                                <input type="text" name="last_name" class="booking__input" value="{!! old('last_name') !!}">
                            </label>
                            <label class="booking__input-label">
                                <span class="booking__input-text">E-mail</span>
                                <input type="email" name="email" class="booking__input" value="{!! old('email') !!}">
                            </label>
                        </div>
                    </div>
                </fieldset>

                <div class="booking__availability-info" style="display: none;">
                    <p class="booking__availability-text"></p>
                </div>

                <button type="submit" class="booking__submit">Book now</button>
            </div>
        </form>
    </div>
</section>
