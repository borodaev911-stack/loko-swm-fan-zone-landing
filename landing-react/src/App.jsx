import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Вставьте реальные ссылки на регистрацию перед публикацией страницы.
const CHANNEL_LINKS = {
  telegram: "",
  max: "",
};

const steps = [
  ["01", "subscribe", "Откройте бота", "Выберите Telegram или MAX и начните регистрацию."],
  ["02", "qr", "Получите QR-код", "Бот выдаст персональный QR-код участника."],
  ["03", "reward", "Играйте и получайте баллы", "Показывайте QR-код на конкурсах и обменивайте баллы на подарки."],
];

const contests = [
  ["01", "red", "shot", "Удар по воротам", "Проверьте точность и отправьте мяч точно в цель.", "Меткость"],
  ["02", "cream", "quiz", "Футбольный квиз", "Ответьте на вопросы о футболе и любимом клубе.", "Знания"],
  ["03", "green", "slalom", "Змейка", "Проведите мяч между фишками на скорость.", "Техника"],
  ["04", "lime", "wheel", "Колесо фортуны", "Крутите колесо и узнайте, какой бонус выпадет вам.", "Удача"],
  ["05", "white", "juggle", "Чеканка", "Не дайте мячу коснуться земли как можно дольше.", "Контроль"],
  ["06", "blue", "chant", "Составь кричалку", "Придумайте яркую кричалку и зарядите фан-зону.", "Креатив"],
];

const prizes = [
  ["1 штука", "ps5", "PlayStation 5", "PlayStation 5 Slim Digital Edition в стиле pop art"],
  ["Скорость", "rdrc", "Билеты на RDRC", "Старт двух автомобилей в дрэг-рейсинге RDRC в стиле pop art"],
  ["Эксклюзив", "balls", "Мячи с автографами", "Футбольные мячи с автографами в стиле pop art"],
];

const merchandise = [
  ["wide", "scarf-optimized.png", "Красно-зелёный шарф Локомотива", "Фанатская атрибутика", "Шарф", "Чтобы цвета клуба всегда были рядом."],
  ["", "opener.png", "Красный брелок-открывашка", "Полезный сувенир", "Брелок-открывашка", ""],
  ["", "magazine.jpg", "Предматчевый журнал Локомотива", "С автографами", "Журнал «Наш Локо»", ""],
  ["", "fan-hat.png", "Шапка болельщика в цветах Локомотива", "Для трибун", "Шапка болельщика", ""],
  ["bonus", "air-freshener.png", "Ароматизатор в форме футболки Локомотива", "Бонус", "Ароматизатор", "Подарок-флаер для тех, кто не успел поучаствовать."],
];

const rules = [
  ["Откройте бота", "Выберите Telegram или MAX и начните регистрацию."],
  ["Подпишитесь на один из ресурсов", "Для участия обязательна подписка хотя бы на один ресурс: Telegram или MAX."],
  ["Получите QR-код", "Бот выдаст персональный QR-код участника. Показывайте его перед каждым конкурсом."],
  ["Копите баллы и получайте подарки", "Участвуйте в активностях и обменивайте накопленные баллы на фирменную атрибутику."],
  ["Оставьте прогноз", "Сделайте прогноз на точный счёт, чтобы участвовать в розыгрыше главных призов."],
];

const faqItems = [
  ["join", "Как принять участие?", "Выберите удобный бот — Telegram или MAX — и пройдите быструю регистрацию. После этого бот выдаст ваш персональный QR-код участника."],
  ["subscription", "Нужно подписываться и на Telegram, и на MAX?", "Нет. Для участия достаточно выбрать и подписаться на один из ресурсов — Telegram или MAX."],
  ["qr", "Зачем нужен QR-код и где его показывать?", "QR-код подтверждает ваше участие. Показывайте его перед каждой активностью в фан-зоне, чтобы получить баллы за конкурс."],
  ["activities", "В каких активностях можно участвовать?", "Вас ждут шесть активностей: удар по воротам, футбольный квиз, змейка, колесо фортуны, чеканка и конкурс кричалок. Участвуйте в одной или проходите все."],
  ["points", "Как начисляются баллы и на что их можно обменять?", "Баллы начисляются за участие в активностях. Накопленные баллы можно обменять на фирменную атрибутику «Локомотива»."],
  ["prediction", "Как получить возможность сделать прогноз на матч?", "После регистрации в Telegram-боте вы сможете сделать прогноз на матч. Он даёт возможность участвовать в розыгрыше главного приза."],
  ["prizes", "Какие призы можно выиграть?", "Главные призы — PlayStation 5, билеты на RDRC и мячи с автографами. За баллы в активностях также можно выбрать фанатскую атрибутику."],
];

const clampScore = (value) => Math.max(0, Math.min(9, value));

function ChannelButton({ channel, compact = false, hero = false, onOpen }) {
  const label = channel === "telegram" ? "Telegram" : "MAX";
  const icon = channel === "telegram" ? "telegram-optimized.jpg" : "max-optimized.jpg";

  if (compact) {
    return (
      <button type="button" className={`mini-channel mini-channel--${channel}`} data-channel={channel} onClick={() => onOpen(channel)}>
        <img src={`/${icon}`} alt="" />Участвовать через {label} <span aria-hidden="true">↗</span>
      </button>
    );
  }

  return (
    <button className={`channel channel--${channel}`} type="button" data-channel={channel} aria-label={`Зарегистрироваться в ${label}`} onClick={() => onOpen(channel)}>
      <span className="channel__shine" aria-hidden="true" />
      <span className="channel__icon-wrap"><img src={`/${icon}`} alt="" /></span>
      <span className="channel__copy">
        <span className="channel__overline">{hero ? "Участвовать в" : "Зарегистрироваться в"}</span>
        <strong>{label}</strong>
        <span className="channel__action">Открыть бота</span>
      </span>
    </button>
  );
}

function CtaButton({ channel, onOpen }) {
  const label = channel === "telegram" ? "Telegram" : "MAX";
  const icon = channel === "telegram" ? "telegram-optimized.jpg" : "max-optimized.jpg";
  return (
    <button className={`cta-button cta-button--${channel}`} type="button" data-channel={channel} onClick={() => onOpen(channel)}>
      <img src={`/${icon}`} alt="" />
      <span className="cta-button__label"><small>Сделать прогноз</small><strong>{label}</strong></span>
      <span className="cta-button__arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function PrivacyPolicyDialog({ open, onClose }) {
  const closeButton = useRef(null);
  const dialog = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = [...(dialog.current?.querySelectorAll("a[href], button:not([disabled])") ?? [])];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButton.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="privacy-dialog__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="privacy-dialog" ref={dialog} role="dialog" aria-modal="true" aria-labelledby="privacy-title">
        <header className="privacy-dialog__header">
          <p>ФК Локомотив × SWM</p>
          <button ref={closeButton} className="privacy-dialog__close" type="button" onClick={onClose} aria-label="Закрыть политику конфиденциальности"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
        </header>
        <div className="privacy-dialog__scroll">
          <div className="privacy-dialog__content">
            <h2 id="privacy-title">Политика обработки персональных данных</h2>
            <p className="privacy-dialog__lead">для участников мероприятия «ФК Локомотив × SWM»</p>

            <h3>1. Оператор и область действия</h3>
            <p>Оператор персональных данных — Общество с ограниченной ответственностью «АСЦ» (ООО «АСЦ»), ОГРН 1257700197974, ИНН 7743470305, адрес: 125080, г. Москва, Волоколамское ш., д. 1, стр. 1, помещ. 55/8.</p>
            <p>Политика применяется к сайту мероприятия «ФК Локомотив × SWM».</p>

            <h3>2. Что происходит на сайте</h3>
            <p>На сайте нет форм для ввода персональных данных, личного кабинета и регистрации. Выбор счёта в блоке прогноза работает только в браузере пользователя и не направляется Оператору.</p>
            <p>Сайт содержит кнопки перехода в Telegram и MAX. Сам по себе переход по такой ссылке не означает передачу Оператору персональных данных, введённых или хранящихся в соответствующем сервисе.</p>

            <h3>3. Яндекс.Метрика</h3>
            <p>Для анализа посещаемости и улучшения работы сайта Оператор использует сервис веб-аналитики Яндекс.Метрика. Счётчик автоматически собирает сведения о посещении сайта и действиях на его страницах, технические данные об устройстве, браузере и операционной системе, файлы cookie и IP-адрес.</p>
            <p>Яндекс обрабатывает эти данные по поручению Оператора для предоставления статистики. Условия обработки данных сервисом опубликованы в <a href="https://yandex.ru/legal/metrica_termsofuse/ru/" rel="noopener noreferrer" target="_blank">условиях использования Яндекс.Метрики</a>. Для учёта посетителей сервис использует идентификаторы браузера, сохраняемые в cookie и localStorage.</p>
            <p>Пользователь может ограничить или удалить cookie в настройках браузера. В этом случае отдельные функции статистики могут работать некорректно.</p>

            <h3>4. Telegram, MAX и боты</h3>
            <p>Регистрация участника, выдача QR-кода и прогноз результата, если они доступны, выполняются в ботах Telegram или MAX, а не на этом сайте. К отношениям пользователя с владельцами этих сервисов применяются их собственные документы и настройки конфиденциальности.</p>
            <p>Если бот запрашивает персональные данные для участия в мероприятии, до их предоставления пользователю должны быть доступны сведения о составе данных, целях и сроке обработки, Операторе и порядке отзыва согласия. Настоящая страница не заменяет такие сведения или согласие в боте.</p>

            <h3>5. Принципы и меры защиты</h3>
            <p>Оператор обрабатывает персональные данные в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»: для конкретных и законных целей, в объёме, необходимом для их достижения, и с применением правовых, организационных и технических мер защиты.</p>
            <p>Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, предоставления и распространения.</p>
            <p>Персональные данные уничтожаются или обезличиваются после достижения цели обработки, если иной срок не установлен законодательством Российской Федерации или законным основанием обработки.</p>

            <h3>6. Права участника</h3>
            <p>Участник вправе получить сведения об обработке своих данных, потребовать уточнения, блокирования или уничтожения данных в случаях, установленных законом, а также отозвать согласие на их обработку.</p>
            <p>Для обращения по вопросам обработки данных или отзыва согласия направьте письмо на <a href="mailto:info@ascauto.ru">info@ascauto.ru</a>. Оператор рассматривает обращения в сроки, установленные законодательством Российской Федерации.</p>

            <h3>7. Заключительные положения</h3>
            <p>К настоящей Политике применяется законодательство Российской Федерации, включая Федеральный закон от 27.07.2006 № 152-ФЗ «О персональных данных». Оператор вправе обновить Политику при изменении порядка обработки данных или требований законодательства. Актуальная редакция размещается в этом окне на сайте мероприятия.</p>
            <p className="privacy-dialog__updated">Дата публикации: 21 августа 2026 года.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [scores, setScores] = useState({ home: 2, away: 1 });
  const [toast, setToast] = useState(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState("join");
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [scoreRegistrationOpen, setScoreRegistrationOpen] = useState(false);
  const page = useRef(null);
  const toastTimer = useRef();
  const scoreRegistrationTimer = useRef();
  const centerpiece = useRef(null);
  const registration = useRef(null);
  const privacyTrigger = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(toastTimer.current);
    window.clearTimeout(scoreRegistrationTimer.current);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(frame);
  }, [openFaqId]);

  useEffect(() => {
    const updateVisibility = () => {
      const secondScreen = document.querySelector("#how");
      const threshold = secondScreen?.offsetTop ?? window.innerHeight;
      setBackToTopVisible(window.scrollY >= threshold);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  function closePrivacy() {
    setPrivacyOpen(false);
    window.setTimeout(() => privacyTrigger.current?.focus(), 0);
  }

  useLayoutEffect(() => {
    const root = page.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    root.dataset.motion = "enhanced";

    const context = gsap.context(() => {
      const clearEntryProps = "transform,opacity,visibility";
      const entry = gsap.timeline({ defaults: { ease: "power3.out" } });

      entry
        .from(root.querySelector(".brand-lockup"), { autoAlpha: 0, y: -18, duration: 0.45, clearProps: clearEntryProps })
        .from(root.querySelector(".matchday-label"), { autoAlpha: 0, x: 16, duration: 0.35, clearProps: clearEntryProps }, "<0.08")
        .from(root.querySelectorAll(".hero__heading > *"), { autoAlpha: 0, y: 22, duration: 0.52, stagger: 0.1, clearProps: clearEntryProps }, "<0.12")
        .from(root.querySelectorAll(".hero__registration > .channel"), { autoAlpha: 0, y: 28, duration: 0.48, stagger: 0.12, clearProps: clearEntryProps }, "<0.12")
        .from(root.querySelector(".comic-title"), { autoAlpha: 0, scale: 0.86, duration: 0.38, clearProps: clearEntryProps }, "<0.04")
        .from(root.querySelectorAll(".prize-collage > *"), { autoAlpha: 0, y: 18, scale: 0.94, duration: 0.45, stagger: 0.06, clearProps: clearEntryProps }, "<0.04");

      const revealTargets = [...root.querySelectorAll(".reveal")];
      gsap.set(revealTargets, { autoAlpha: 0, y: 28 });
      ScrollTrigger.batch(revealTargets, {
        start: "top 86%",
        once: true,
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: clearEntryProps,
          overwrite: true,
        }),
      });

      gsap.to(root.querySelector(".hero__halftone"), {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".hero"),
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });

      const legend = root.querySelector(".section--legend");
      if (legend) {
        const legendCopy = legend.querySelector(".legend-copy");
        const legendVisual = legend.querySelector(".legend-visual");
        const legendPortrait = legend.querySelector(".legend-portrait");
        const legendImage = legend.querySelector(".legend-portrait img");
        const legendBurst = legend.querySelector(".legend-visual__burst");
        const legendHalo = legend.querySelector(".legend-visual__halo");
        const legendNet = legend.querySelector(".legend-visual__net");

        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: legend,
            start: "top 72%",
            once: true,
          },
        })
          .from(legendCopy.querySelectorAll("h2 span"), { autoAlpha: 0, x: -42, duration: 0.5, stagger: 0.12, clearProps: clearEntryProps })
          .from(legendCopy.querySelector("p"), { autoAlpha: 0, y: 18, duration: 0.42, clearProps: clearEntryProps }, "<0.16")
          .from(legendHalo, { autoAlpha: 0, duration: 0.34, clearProps: "opacity,visibility" }, "<0.1")
          .from(legendBurst, { autoAlpha: 0, duration: 0.32, clearProps: "opacity,visibility" }, "<")
          .from(legendImage, { autoAlpha: 0, y: 54, scale: 0.94, duration: 0.62, clearProps: clearEntryProps }, "<0.05");

        gsap.to(legendPortrait, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: legend,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.75,
          },
        });

        gsap.to(legendBurst, {
          rotation: 24,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: legend,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(legendHalo, {
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: legend,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(legendNet, {
          xPercent: 9,
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: legend,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }

      gsap.to(root.querySelector(".score-burst"), {
        rotation: 25,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector(".section--score"),
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }, root);

    return () => {
      context.revert();
      delete root.dataset.motion;
    };
  }, []);

  function openChannel(channel) {
    const url = CHANNEL_LINKS[channel];
    if (url) {
      window.location.href = url;
      return;
    }
    window.clearTimeout(toastTimer.current);
    setToast(channel);
    toastTimer.current = window.setTimeout(() => setToast(null), 3600);
  }

  function changeScore(team, delta) {
    setScores((current) => ({ ...current, [team]: clampScore(current[team] + delta) }));
  }

  function showScoreRegistration() {
    setScoreRegistrationOpen(true);
    window.clearTimeout(scoreRegistrationTimer.current);
    scoreRegistrationTimer.current = window.setTimeout(() => setScoreRegistrationOpen(false), 20000);
    window.requestAnimationFrame(() => {
      registration.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    });
  }

  function moveCenterpiece(event) {
    if (!window.matchMedia("(pointer: fine)").matches || !centerpiece.current) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 5;
    centerpiece.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <div ref={page}>
      <a className="skip-link" href="#contests">Перейти к конкурсам</a>

      <header className="hero" id="top" onPointerMove={moveCenterpiece} onPointerLeave={() => { if (centerpiece.current) centerpiece.current.style.transform = "translate3d(0, 0, 0)"; }}>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__halftone" aria-hidden="true" />
        <div className="brand-lockup"><img className="brand-lockup__cobrand" src="/cobrand-optimized.jpg" alt="ФК Локомотив × SWM" /></div>
        <div className="matchday-label">Фан-зона / Матчдей</div>

        <div className="hero__heading">
          <h1>Регистрация за один шаг</h1>
          <p>Выберите Telegram или MAX — бот зарегистрирует вас и откроет доступ к конкурсам и призам.</p>
        </div>

        <div className="hero__registration" ref={registration} role="group" aria-label="Способы регистрации">
          <ChannelButton channel="telegram" hero onOpen={openChannel} />
          <span className="hero__or">или</span>
          <div className={`hero__centerpiece${scoreRegistrationOpen ? " hero__centerpiece--registration" : ""}`} ref={centerpiece} role="img" aria-label={scoreRegistrationOpen ? "Чтобы сделать ставку, выберите регистрацию в Telegram или MAX" : "Главные призы: PlayStation 5, билеты на RDRC и мячи с автографами"}>
            {scoreRegistrationOpen ? (
              <div className="registration-prompt">
                <span className="registration-prompt__eyebrow">Для прогноза</span>
                <strong>Чтобы сделать<br />ставку</strong>
                <p>зарегистрируйтесь<br /><b>в Telegram или MAX</b></p>
                <img className="registration-prompt__arrow" src="/registration-pop-art-arrow-v1.png" alt="" aria-hidden="true" />
              </div>
            ) : <>
              <div className="comic-title"><span className="comic-title__top">Болей. Играй.</span><strong>Выигрывай!</strong></div>
              <div className="prize-collage" aria-hidden="true">
                <div className="prize-collage__glow" />
                <img className="prize-collage__ps5" src="/ps5-store77-large.jpg" alt="" />
                <img className="prize-collage__ball" src="/ball-optimized.png" alt="" />
                <div className="race-ticket"><div className="race-ticket__copy"><strong>RDRC</strong><span>БИЛЕТЫ НА ДРЭГ-РЕЙСИНГ</span></div></div>
                <img className="prize-collage__scarf" src="/scarf-optimized.png" alt="" />
              </div>
              <div className="prize-caption"><span>Главные призы</span> PS5 / RDRC / мячи с автографами</div>
            </>}
          </div>
          <ChannelButton channel="max" hero onOpen={openChannel} />
        </div>
        <span className="sticker sticker--wow" aria-hidden="true">WOW!</span>
        <span className="sticker sticker--goal" aria-hidden="true">GO!</span>
      </header>

      <main>
        <div className="ticker" aria-hidden="true"><div className="ticker__track">
          <span>6 конкурсов</span><i>★</i><span>Баллы за участие</span><i>★</i><span>Фанатские призы</span><i>★</i><span>Угадай точный счёт</span><i>★</i>
          <span>6 конкурсов</span><i>★</i><span>Баллы за участие</span><i>★</i><span>Фанатские призы</span><i>★</i><span>Угадай точный счёт</span><i>★</i>
        </div></div>

        <section className="section section--how" id="how"><div className="section__inner">
          <div className="section-heading reveal"><h2>Один QR-код — весь путь на фан-зоне.</h2><p>Зарегистрируйтесь один раз и участвуйте во всех активностях матчдея.</p></div>
          <div className="steps">{steps.map(([number, icon, title, copy]) => (
            <article className="step reveal" key={number}><span className="step__number">{number}</span><div className={`step__icon pop-icon pop-icon--${icon}`} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>
          ))}</div>
        </div></section>

        <section className="section section--contests" id="contests"><div className="section__inner">
          <div className="section-heading section-heading--light reveal"><h2>Шесть активностей — шесть способов набрать баллы.</h2><p>Проверьте меткость, технику, футбольные знания и удачу.</p></div>
          <div className="contest-grid">{contests.map(([number, color, icon, title, copy, tag]) => (
            <article className={`contest-card contest-card--${color} reveal`} key={number}><span className="contest-card__index">{number}</span><span className={`contest-card__icon pop-icon pop-icon--${icon}`} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p><span className="contest-card__tag">{tag}</span></article>
          ))}</div>
        </div></section>

        <section className="section section--legend" id="legend">
          <div className="section__inner legend-layout">
            <div className="legend-copy">
              <h2><span>Руслан</span><span>Нигматуллин</span></h2>
              <p>Фото и автограф с легендарным вратарём «Локомотива».</p>
            </div>
            <div className="legend-visual">
              <span className="legend-visual__burst" aria-hidden="true" />
              <span className="legend-visual__halo" aria-hidden="true" />
              <span className="legend-visual__net" aria-hidden="true" />
              <div className="legend-portrait">
                <img src="/ruslan-nigmatullin-autograph-pop-art-cream.png" alt="Руслан Нигматуллин подписывает футбольный мяч" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section className="section section--score" id="score">
          <div className="score-burst" aria-hidden="true" />
          <div className="section__inner score-layout">
            <div className="score-copy reveal"><span className="sticker-inline">Грандиозный розыгрыш!</span><h2>Угадайте точный счёт — участвуйте в розыгрыше.</h2><p>Сделайте прогноз в боте и получите шанс выиграть главные призы.</p><div className="score-cta-buttons"><CtaButton channel="telegram" onOpen={openChannel} /><CtaButton channel="max" onOpen={openChannel} /></div></div>
            <div className="scoreboard reveal" role="group" aria-label="Пример прогноза на точный счёт">
              <div className="scoreboard__team"><img src="/fclm-logo-small.png" alt="Локомотив" /><span>Локомотив</span></div>
              <div className="scoreboard__digits"><span>{scores.home}</span><i>:</i><span>{scores.away}</span></div>
              <div className="scoreboard__team scoreboard__team--opponent"><div aria-hidden="true">?</div><span>Соперник</span></div>
              <div className="scoreboard__footer"><div className="scoreboard__controls">
                <div className="scoreboard__control-group"><button type="button" onClick={() => changeScore("home", -1)} aria-label="Уменьшить счёт Локомотива">−</button><span>Локомотив</span><button type="button" onClick={() => changeScore("home", 1)} aria-label="Увеличить счёт Локомотива">+</button></div>
                <div className="scoreboard__control-group"><button type="button" onClick={() => changeScore("away", -1)} aria-label="Уменьшить счёт соперника">−</button><span>Соперник</span><button type="button" onClick={() => changeScore("away", 1)} aria-label="Увеличить счёт соперника">+</button></div>
              </div><button className="scoreboard__submit" type="button" onClick={showScoreRegistration}>Поставить</button></div>
            </div>
          </div>
          <div className="grand-prizes section__inner">{prizes.map(([label, art, title, description]) => (
            <article className={`grand-prize ${art === "ps5" ? "grand-prize--ps5" : ""} reveal`} key={art}><span>{label}</span><div className={`grand-prize__art grand-prize__art--${art}`} role="img" aria-label={description} /><div><small>Главный приз</small><h3>{title}</h3></div></article>
          ))}</div>
        </section>

        <section className="section section--shop" id="shop"><div className="section__inner">
          <div className="section-heading reveal"><h2>Набрали баллы — выберите подарок.</h2><p>Участвуйте в конкурсах, показывайте QR-код и обменивайте баллы на фирменную атрибутику.</p></div>
          <div className="merch-grid">{merchandise.map(([variant, image, alt, label, title, copy]) => (
            <article className={`merch-card${variant ? ` merch-card--${variant}` : ""} reveal`} key={title}><div className="merch-card__image"><img src={`/${image}`} alt={alt} /></div><div><span>{label}</span><h3>{title}</h3>{copy && <p>{copy}</p>}</div></article>
          ))}</div>
        </div></section>

        <section className="section section--rules" id="rules"><div className="section__inner rules-layout">
          <div className="section-heading section-heading--light reveal"><h2>Как участвовать</h2></div>
          <ol className="rules-list">{rules.map(([title, copy], index) => <li className="reveal" key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol>
        </div></section>

        <section className="final-cta"><div className="final-cta__noise" aria-hidden="true" /><div className="final-cta__content reveal"><h2>Ваш путь к призам<br />начинается здесь.</h2><div className="final-cta__buttons"><ChannelButton channel="telegram" compact onOpen={openChannel} /><ChannelButton channel="max" compact onOpen={openChannel} /></div></div></section>

        <section className="section section--faq" id="faq" aria-labelledby="faq-title">
          <div className="section__inner faq-layout">
            <div className="section-heading faq-heading reveal">
              <span className="faq-heading__eyebrow">Вопрос / ответ</span>
              <h2 id="faq-title">Всё, что важно знать перед матчем.</h2>
              <p>Собрали ответы, чтобы вы быстро перешли от регистрации к участию и призам.</p>
            </div>
            <div className="faq-list">
              {faqItems.map(([id, question, answer], index) => {
                const isOpen = openFaqId === id;
                const answerId = `faq-answer-${id}`;
                return (
                  <article className={`faq-item reveal${isOpen ? " is-open" : ""}`} key={id}>
                    <button className="faq-item__trigger" type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenFaqId(isOpen ? null : id)}>
                      <span className="faq-item__number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="faq-item__question">{question}</span>
                      <span className="faq-item__icon" aria-hidden="true" />
                    </button>
                    <div className="faq-item__answer-wrap" id={answerId} role="region" aria-label={question} aria-hidden={!isOpen}>
                      <div className="faq-item__answer"><p>{answer}</p></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer><div className="footer-brand"><img src="/cobrand-optimized.jpg" alt="ФК Локомотив × SWM" /></div><p>Болейте вместе с «Локомотивом»</p><div className="footer-links"><button className="footer-policy-link" type="button" ref={privacyTrigger} onClick={() => setPrivacyOpen(true)}>Политика конфиденциальности</button><a href="/privacy-policy.html">Политика обработки персональных данных</a><a href="/contest-rules.html">Правила проведения конкурса</a></div></footer>

      {backToTopVisible && <button className="back-to-top is-visible" type="button" onClick={scrollToTop} aria-label="Вернуться наверх"><span aria-hidden="true">↑</span><b>Наверх</b></button>}

      <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite" hidden={!toast}><strong>Почти готово!</strong><span>Добавьте ссылку для {toast === "telegram" ? "Telegram" : "MAX"} в файле App.jsx.</span></div>
      <PrivacyPolicyDialog open={privacyOpen} onClose={closePrivacy} />
    </div>
  );
}
