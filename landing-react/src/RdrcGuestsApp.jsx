import { useState } from 'react';
import './rdrc-guests.css';

const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
const channels = [
  ['Telegram', 'telegram', 'https://t.me/PRIEZDAUTO_BOT'],
  ['MAX', 'max', 'https://max.ru/id7720931920_2_bot'],
];
const steps = [
  ['Открой бот', 'Выбери Telegram или MAX. Пройди регистрацию участника.', 'ВЫБЕРИ БОТ'],
  ['Получи свой QR', 'Показывай персональный QR-код на активностях для начисления баллов.', 'ПОКАЖИ QR'],
  ['Набери 200 баллов', 'Участвуй в розыгрыше PS5 и автопризов среди участников конкурса.', 'СКАНИРУЙ НА ИГРАХ'],
];
const activities = [
  ['Чеканка', 'Играйте вместе. Ловите ритм и забирайте баллы.', 'Ребёнок и взрослый вместе чеканят мяч'],
  ['Удар по воротам', 'Выберите свою траекторию. Удар, улыбка, баллы.', 'Мама с дочкой бьют по воротам'],
  ['Колесо фортуны', 'Крутите вместе. Испытайте семейную удачу.', 'Семья крутит колесо фортуны'],
  ['Змейка', 'Пройдите трассу. Главное - поддерживать друг друга.', 'Папа с ребёнком проходят змейку с мячом'],
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ChannelCards() {
  return <div className="rg-channel-grid" aria-label="Выберите мессенджер для регистрации">
    {channels.map(([title, key, href]) => (
      <a className={`rg-channel rg-channel--${key}`} href={href} target="_blank" rel="noreferrer" key={key}>
        <img src={asset(`${key}-optimized.jpg`)} alt="" />
        <small>ПОЛУЧИТЬ QR В</small>
        <strong>{title}</strong>
        {key === 'max' && <span className="rg-channel-hint">НАПИШИ СООБЩЕНИЕ ДЛЯ ЗАПУСКА</span>}
        <b>Зарегистрироваться <Arrow /></b>
      </a>
    ))}
  </div>;
}

export default function RdrcGuestsApp() {
  const [model, setModel] = useState('MAGE');

  return <div className="rdrc-guests">
    <a className="rg-skip" href="#registration">К регистрации</a>
    <header className="rg-header">
      <a href="#registration" className="rg-brands" aria-label="АСЦ Авто и DONGFENG">
        <img src={asset('asc-auto-logo-complete.png')} alt="АСЦ Авто" /> <b>×</b>
        <img src={asset('dongfeng-logo.svg')} alt="DONGFENG" />
      </a>
      <div><strong>12-13 СЕНТЯБРЯ</strong><small>2026 · СУПЕРКУБОК RDRC</small></div>
    </header>
    <main>
      <section className="rg-hero" id="registration">
        <div className="rg-hero-copy">
          <h1>ИГРАЙ. ДРАЙВУЙ.<br /><em>ПОБОРИСЬ ЗА PS5!</em></h1>
          <p>На площадке <b>АСЦ Авто × DONGFENG</b>: четыре активности, тест-драйв и призы. <b>Набери 200 баллов</b> и участвуй в розыгрыше.</p>
        </div>
        <ChannelCards />
        <div className="rg-prize-card"><span>ГЛАВНЫЙ ПРИЗ</span><img src={asset('ps5-rdrc.webp')} alt="PlayStation 5 с контроллером" /><b>200 БАЛЛОВ - ТЫ В ИГРЕ</b></div>
        <p className="rg-hero-note">Выбери мессенджер, зарегистрируйся, получи свой QR-код.</p>
      </section>

      <section className="rg-how" id="how">
        <div><h2>ОДИН QR.<br />ЧЕТЫРЕ АКТИВНОСТИ.<br />ТВОЙ ШАНС НА ПРИЗ.</h2><a href="#registration" className="rg-dark-button">Получить QR участника <Arrow /></a></div>
        <ol>{steps.map(([title, copy, action], index) => <li key={title}><b>0{index + 1}</b><div><h3>{title}</h3><p>{copy}</p><span>✦ {action}</span></div></li>)}</ol>
      </section>

      <section className="rg-challenge" id="million">
        <div className="rg-challenge-art" aria-hidden="true" />
        <div className="rg-challenge-copy"><h2>СНИМАЙТЕ DONGFENG.<br />СОБИРАЙТЕ ПРОСМОТРЫ.<br />БОРИТЕСЬ ЗА ПРИЗЫ.</h2><p>Каждый миллион учтённых просмотров конкурсных роликов добавляет 100 000 ₽ в общий фонд. Максимальный фонд - 1 000 000 ₽.</p><a className="rg-challenge-cta" href="million-challenge.html">Принять вызов и выбрать сторону <Arrow /></a><a className="rg-rules-link" href="million-challenge.html">Условия конкурса и как стать участником</a></div>
      </section>

      <section className="rg-activities" id="contests">
        <h2>ХВАТИТ СМОТРЕТЬ.<br />ВКЛЮЧАЙСЯ В ИГРУ!</h2><p>Покажи технику, проверь точность и испытай удачу. За участие в активностях - баллы.</p>
        <div className="rg-activity-grid">{activities.map(([title, copy, alt], index) => <article className={`rg-activity rg-activity--${index + 1}`} key={title}><div className="rg-activity-art" role="img" aria-label={`Поп-арт: ${alt}`}><span /></div><div><h3>{title}</h3><p>{copy}</p><a href="#registration">Участвовать <Arrow /></a></div></article>)}</div>
      </section>

      <section className="rg-drive" id="drive">
        <div><h2>ДВА ХАРАКТЕРА.<br />ПОПРОБУЙ ОБА.</h2><p>DONGFENG MAGE и HUGE ждут на площадке RDRC. Выбери модель для тест-драйва.</p></div>
        <div className="rg-models" aria-label="Выбор модели">{['MAGE', 'HUGE'].map((name) => <button key={name} type="button" aria-pressed={model === name} onClick={() => setModel(name)}><small>DONGFENG</small><strong>{name}</strong><span>{model === name ? 'ВЫБРАНО' : 'ВЫБРАТЬ'}</span></button>)}</div>
        <a className="rg-dark-button" href="#registration">Получить QR и записаться <Arrow /></a>
      </section>
    </main>
    <footer className="rg-footer"><b>АСЦ Авто × DONGFENG</b><a href="#how">Как участвовать</a><a href="#drive">Хочу на тест-драйв</a><small>12-13 сентября 2026 · Суперкубок RDRC</small></footer>
  </div>;
}
