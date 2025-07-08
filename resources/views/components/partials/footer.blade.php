@php
    $data = config('contacts');
@endphp

<footer class="footer">
    <section class="footer__contacts" data-scroll-target="footer">
        <div class="container">
            <h2 class="footer__title">{!! get_data($data, 'title', 'Contacts') !!}</h2>
            <div class="footer__content">
                <div class="footer__info">
                    <address class="footer__address">
                        <div class="footer__detail footer__detail--address">
                            <div class="footer__icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            <div class="footer__text">
                                <span class="footer__city">{!! get_data($data, 'address.city') !!}</span>
                                <span class="footer__street">{!! get_data($data, 'address.street') !!}</span>
                            </div>
                        </div>

                        <div class="footer__detail footer__detail--phone">
                            <div class="footer__icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                </svg>
                            </div>
                            <a href="tel:{!! get_data($data, 'phone.link') !!}" class="footer__link">
                                {!! get_data($data, 'phone.display') !!}
                            </a>
                        </div>

                        <div class="footer__detail footer__detail--email">
                            <div class="footer__icon">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <a href="mailto:{!! get_data($data, 'email') !!}" class="footer__link">
                                {!! get_data($data, 'email') !!}
                            </a>
                        </div>
                    </address>

                    <ul class="footer__social">
                        @foreach(get_data($data, 'social', []) as $social)
                            <li class="footer__social-item">
                                <a href="{!! get_data($social, 'url') !!}"
                                   target="_blank"
                                   class="footer__social-link footer__social-link--{!! get_data($social, 'type') !!}"
                                   title="{!! get_data($social, 'name') !!}">
                                    <svg viewBox="0 0 24 24" fill="currentColor">
                                        <path d="{!! get_data($social, 'icon') !!}"/>
                                    </svg>
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>

                <div class="footer__map">
                    <iframe
                        src="{!! get_data($data, 'map.embed_url') !!}"
                        class="footer__iframe"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </div>
    </section>

    <div class="footer__copyright">
        <div class="container">
            <div class="footer__copyright-content">
                <p class="footer__copyright-text">
                    © {!! get_data($data, 'copyright.company') !!}, {!! date('Y') !!}
                </p>
                <p class="footer__copyright-text">
                    Design is inspired by
                    <a href="mailto:{!! get_data($data, 'designer.email') !!}" class="footer__designer-link">
                        {!! get_data($data, 'designer.name') !!}
                    </a>
                </p>
            </div>
        </div>
    </div>

    <button id="scroll-to-top" class="scroll-to-top" aria-label="Back to top">
        ↑
    </button>
</footer>
