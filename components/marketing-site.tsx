"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ChartLineUp,
  Check,
  FireSimple,
  Funnel,
  Gift,
  LinkSimple,
  PaperPlaneTilt,
  Star,
  X,
} from "@phosphor-icons/react";
import { leadSchema } from "@/lib/lead-schema";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FormValues = {
  name: string;
  kindergarten: string;
  location: string;
  openSpots: number;
  contact: string;
  consent: boolean;
  website: string;
};

const qualifiers = [
  "уже ищут качественный сад для ребёнка",
  "подходят по уровню и ожиданиям",
  "готовы прийти на экскурсию и выбрать вас",
];

const setupItems = [
  { icon: ChartLineUp, label: "Загрузка и потерянная выручка" },
  { icon: Star, label: "Упаковка ценности" },
  { icon: Funnel, label: "Рекламная воронка" },
  { icon: FireSimple, label: "Прогрев до экскурсии" },
  { icon: PaperPlaneTilt, label: "Заявки на экскурсию" },
  { icon: LinkSimple, label: "Связь рекламы с договором" },
];

const journey = [
  "Первое касание",
  "Атмосфера",
  "Педагоги и программа",
  "Ценность",
  "Целевая заявка",
  "Экскурсия → договор",
];

function Brand() {
  return (
    <Link href="#hero" className="brand" aria-label="МАРКЕТИНГ — на главную">
      МАРКЕТИНГ<span aria-hidden="true" />
    </Link>
  );
}

function SiteHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="site-header">
      <Brand />
      <button className="menu-button" type="button" onClick={onMenu} aria-label="Открыть меню">
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

function CTAButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button className="primary-cta" type="button" onClick={onClick}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" weight="bold" />
    </button>
  );
}

function MenuDrawer({ open, onClose, onLead }: { open: boolean; onClose: () => void; onLead: () => void }) {
  const links = [
    ["Почему теряется прибыль", "#profit"],
    ["Почему нужен поток", "#flow"],
    ["Путь семьи до договора", "#story"],
    ["Что мы настроим", "#system"],
  ];

  return (
    <div
      className={`menu-layer ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      onClick={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <aside className="menu-drawer" aria-label="Панель навигации">
        <div className="menu-drawer__top">
          <Brand />
          <button type="button" className="menu-close" onClick={onClose} aria-label="Закрыть меню">
            <X aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Основная навигация">
          {links.map(([label, href], index) => (
            <a href={href} key={href} onClick={onClose} tabIndex={open ? 0 : -1}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="menu-lead"
          tabIndex={open ? 0 : -1}
          onClick={() => {
            onClose();
            onLead();
          }}
        >
          Получить прогноз <ArrowRight aria-hidden="true" />
        </button>
      </aside>
    </div>
  );
}

function ChairGlyph({ empty = false }: { empty?: boolean }) {
  return (
    <span className={`chair-glyph ${empty ? "is-empty" : ""}`} aria-hidden="true">
      <span className="chair-glyph__back" />
      <span className="chair-glyph__seat" />
    </span>
  );
}

function ApplicationGlyph() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M8 4h14l6 6v22H8zM22 4v7h6M13 17h10M13 22h8M13 27h6" />
      <path d="m24 26 6-6 2 2-6 6-3 1z" />
    </svg>
  );
}

function ContractGlyph() {
  return (
    <svg viewBox="0 0 62 62" aria-hidden="true">
      <path d="M10 6h38v44H10zM18 18h22M18 27h18M18 36h13" />
      <circle cx="44" cy="44" r="10" />
      <path d="m40 52-2 7 6-3 6 3-2-7" />
    </svg>
  );
}

function LeadDialog({ dialogRef }: { dialogRef: React.RefObject<HTMLDialogElement | null> }) {
  const [state, setState] = useState<"idle" | "success">("idle");
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { openSpots: 5, consent: false, website: "" },
  });

  const close = () => {
    dialogRef.current?.close();
    window.setTimeout(() => {
      setState("idle");
      reset({ openSpots: 5, consent: false, website: "" });
    }, 200);
  };

  const onSubmit = handleSubmit((values) => {
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      for (const [field, issues] of Object.entries(fields)) {
        const first = issues?.[0];
        if (first) setError(field as keyof FormValues, { type: "validate", message: first });
      }
      return;
    }

    setState("success");
  });

  return (
    <dialog
      ref={dialogRef}
      className="lead-dialog"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
    >
      <div className="lead-dialog__panel">
        <button className="dialog-close" type="button" onClick={close} aria-label="Закрыть форму">
          <X aria-hidden="true" />
        </button>
        {state === "success" ? (
          <div className="form-success" aria-live="polite">
            <span><Check aria-hidden="true" weight="bold" /></span>
            <h2>Демо-форма работает</h2>
            <p>Поля прошли проверку. В рабочей версии эта заявка будет безопасно отправлена в Telegram.</p>
            <button type="button" className="primary-cta" onClick={close}>Вернуться на сайт</button>
          </div>
        ) : (
          <>
            <p className="dialog-eyebrow">Бесплатный разбор</p>
            <h2>Рассчитаем потенциал дозагрузки сада</h2>
            <p className="dialog-intro">Демонстрация формы: введённые данные никуда не отправляются.</p>
            <form onSubmit={onSubmit} noValidate>
              <div className="form-grid">
                <label>
                  <span>Ваше имя</span>
                  <input autoComplete="name" {...register("name", { required: "Укажите имя" })} />
                  {errors.name && <small>{errors.name.message}</small>}
                </label>
                <label>
                  <span>Название сада</span>
                  <input autoComplete="organization" {...register("kindergarten", { required: "Укажите название сада" })} />
                  {errors.kindergarten && <small>{errors.kindergarten.message}</small>}
                </label>
                <label>
                  <span>Город и страна</span>
                  <input autoComplete="address-level2" {...register("location", { required: "Укажите локацию" })} />
                  {errors.location && <small>{errors.location.message}</small>}
                </label>
                <label>
                  <span>Свободных мест сейчас</span>
                  <input type="number" min="1" max="300" inputMode="numeric" {...register("openSpots", { valueAsNumber: true })} />
                  {errors.openSpots && <small>{errors.openSpots.message}</small>}
                </label>
                <label className="form-wide">
                  <span>Telegram, WhatsApp, телефон или email</span>
                  <input autoComplete="email" placeholder="Как с вами связаться" {...register("contact", { required: "Укажите контакт" })} />
                  {errors.contact && <small>{errors.contact.message}</small>}
                </label>
                <label className="form-honeypot" aria-hidden="true">
                  <span>Сайт</span>
                  <input tabIndex={-1} autoComplete="off" {...register("website")} />
                </label>
              </div>
              <label className="consent-row">
                <input type="checkbox" {...register("consent", { required: "Нужно согласие" })} />
                <span>
                  Согласен на обработку данных и принимаю <Link href="/privacy">политику конфиденциальности</Link>.
                </span>
              </label>
              {errors.consent && <small className="consent-error">{errors.consent.message}</small>}
              <button className="primary-cta form-submit" type="submit">
                Проверить демо-форму
                <ArrowRight aria-hidden="true" weight="bold" />
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

export function MarketingSite() {
  const root = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  const openLeadDialog = () => dialogRef.current?.showModal();

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) return;

      gsap.from(".hero-line", {
        y: 42,
        opacity: 0,
        duration: 1.05,
        stagger: 0.12,
        ease: "power4.out",
      });
      gsap.from(".hero-support, .hero-action, .qualifier-item", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        delay: 0.55,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 48,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.fromTo(
        ".marketing-object",
        {
          autoAlpha: 0,
          x: 120,
          y: 92,
          rotation: -20,
          scale: 0.78,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotation: -8,
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: ".flow-section",
            start: "top 72%",
            once: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".story-panel").forEach((panel) => {
        const children = Array.from(panel.children).filter(
          (child) => !child.classList.contains("contour-lines") && !child.classList.contains("ghost-word"),
        );
        gsap.from(children, {
          opacity: 0,
          y: 34,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 72%", once: true },
        });
      });
    },
    { scope: root },
  );

  const pillars = [
    {
      title: "Атмосфера",
      text: "Показываем пространство, ритм дня и ощущение, в которое родитель хочет привести ребёнка.",
    },
    {
      title: "Педагоги",
      text: "Знакомим с людьми и подходом заранее — ещё до первого вопроса о стоимости.",
    },
    {
      title: "Программа",
      text: "Объясняем, из чего складывается результат ребёнка и почему сад стоит своих денег.",
    },
  ];

  return (
    <main ref={root} className="site-main overflow-x-hidden w-full max-w-full">
      <SiteHeader onMenu={() => setMenuOpen(true)} />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onLead={openLeadDialog} />

      <div className="opening-gradient-run">
        <div className="opening-gradient-run__field" aria-hidden="true" />

      <section id="hero" className="chapter hero-section">
        <div className="ambient ambient--hero" aria-hidden="true" />
        <div className="hero-content">
          <h1>
            <span className="hero-line hero-line--small">Заполните</span>
            <span className="hero-line hero-line--blue">свободные места</span>
            <span className="hero-line hero-line--last">
              <span>в русскоязычном</span> <em>детском саду</em>
              <span className="hero-country">за границей</span>
            </span>
          </h1>
          <div className="hero-lower">
            <p className="hero-support">
              Система привлечения русскоязычных семей, которые уже ищут качественный сад и готовы прийти на экскурсию.
            </p>
            <div className="hero-action">
              <CTAButton onClick={openLeadDialog}>Получить прогноз по набору детей</CTAButton>
            </div>
          </div>
        </div>
        <div className="qualifier-strip" aria-label="Кого приводит система">
          {qualifiers.map((item) => (
            <p className="qualifier-item" key={item}>
              <Check aria-hidden="true" weight="bold" />
              <span>{item}</span>
            </p>
          ))}
          <p className="qualifier-item qualifier-note">
            Есть сильный сад, довольные родители и репутация, но группы всё равно загружены <strong>не на 100%</strong>.
          </p>
        </div>
      </section>

      <section id="profit" className="chapter dark-section profit-section">
        <div className="ambient ambient--right" aria-hidden="true" />
        <div className="chapter-grid">
          <h2 className="display-title display-title--stacked reveal">
            <span className="title-line">Недозагрузка</span>
            <span className="title-line">крадёт <em className="title-accent">прибыль</em></span>
          </h2>
          <div className="profit-data reveal">
            <p className="mega-metric">20–40<sup>%</sup></p>
            <div className="seats-row" aria-label="Шесть занятых и четыре свободных места">
              {Array.from({ length: 10 }, (_, index) => <ChairGlyph key={index} empty={index >= 6} />)}
            </div>
            <p className="capacity-label">Свободная мощность</p>
            <p className="profit-thesis">Недозагрузка 20–40% может означать десятки тысяч евро недополученной прибыли в год</p>
            <div className="copy-columns">
              <p>Свободные места каждый месяц забирают выручку. Вы уже оплачиваете помещение, команду и педагогов — но часть возможностей сада не превращается в доход.</p>
              <p>Увеличьте прибыль без новых групп и найма сотрудников — просто заполнив свободные места.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cost" className="chapter dark-section cost-section">
        <div className="corner-frame" aria-hidden="true" />
        <div className="cost-copy reveal">
          <h2 className="display-title display-title--stacked">
            <span className="title-line">Каждое свободное место</span>
            <span className="title-line">уже стоит вам денег</span>
          </h2>
          <p>Каждый свободный стол, шкафчик и место в группе уже оплачены — даже если ребёнка нет. Сад может принять больше детей уже сейчас, без новых групп и сотрудников.</p>
          <strong>Эти семьи сейчас находятся у конкурентов.</strong>
        </div>
        <div className="chair-stage reveal">
          <p className="cost-number">5–10</p>
          <Image
            className="chair-illustration"
            src="/kindergarten-marketing/assets/kindergarten-chair.png"
            alt="Пустой синий детский стул"
            width={1254}
            height={1254}
            sizes="(max-width: 640px) 74vw, (max-width: 1100px) 42vw, 520px"
          />
          <p>пустых мест в премиальном саду могут стоить дороже, чем зарплата целой команды</p>
        </div>
      </section>

      <section id="ltv" className="chapter dark-section ltv-section">
        <span className="ltv-watermark" aria-hidden="true">LTV</span>
        <div className="ltv-head reveal">
          <h2 className="display-title">Свободное место —<br /><span>выручка на месяцы вперёд</span></h2>
          <p>Это не одна пропущенная оплата. LTV — сумма всех оплат за время, пока ребёнок ходит в сад.</p>
        </div>
        <div className="ltv-table-wrap reveal">
          <p className="table-caption">Сколько ежемесячных оплат теряет сад</p>
          <table className="ltv-table">
            <thead><tr><th>Мест</th><th>6 месяцев</th><th>12 месяцев</th><th>24 месяца</th></tr></thead>
            <tbody>
              <tr><th>3<small>места</small></th><td>18<small>оплат</small></td><td>36<small>оплат</small></td><td>72<small>оплат</small></td></tr>
              <tr><th>5<small>мест</small></th><td>30<small>оплат</small></td><td>60<small>оплат</small></td><td>120<small>оплат</small></td></tr>
              <tr><th>10<small>мест</small></th><td>60<small>оплат</small></td><td>120<small>оплат</small></td><td className="table-hot">240<small>оплат</small></td></tr>
            </tbody>
          </table>
        </div>
      </section>
      </div>

      <section id="flow" className="chapter light-section flow-section">
        <div className="flow-copy reveal">
          <h2 className="display-title display-title--stacked">
            <span className="title-line">Даже сильному саду</span>
            <span className="title-line">нужен постоянный поток</span>
            <span className="title-line">новых семей</span>
          </h2>
          <p>Проблема не в качестве сада. Проблема в постоянном притоке новых семей.</p>
        </div>
        <div className="flow-timeline flow-timeline--desktop reveal" aria-label="Естественная ротация семей в течение года">
          <div className="flow-line" />
          {Array.from({ length: 18 }, (_, index) => (
            <span className={`flow-seat ${[2, 8, 14].includes(index) ? "is-leaving" : ""}`} key={index}>
              <ChairGlyph />
            </span>
          ))}
          <span className="month month--one">Сентябрь</span>
          <span className="month month--two">Январь</span>
          <span className="month month--three">Апрель</span>
          <span className="month month--four">Июнь</span>
        </div>
        <div className="flow-timeline-mobile reveal" aria-label="Естественная ротация семей: сентябрь, январь и апрель">
          {["Сентябрь", "Январь", "Апрель"].map((month) => (
            <div className="flow-mobile-stage" key={month}>
              <div className="flow-mobile-seats" aria-hidden="true">
                <span className="flow-mobile-seat"><ChairGlyph /></span>
                <span className="flow-mobile-seat"><ChairGlyph /></span>
                <span className="flow-mobile-seat is-leaving"><ChairGlyph /></span>
              </div>
              <span className="flow-mobile-loss">−1 семья</span>
              <span className="flow-mobile-month">{month}</span>
            </div>
          ))}
        </div>
        <div className="flow-reasons reveal">
          <div><h3>Дети выпускаются</h3><p>Каждый год часть детей переходит в школу.</p></div>
          <div><h3>Семьи переезжают</h3><p>Работа, документы и личные обстоятельства.</p></div>
          <div><h3>Семьи меняют страну или район</h3><p>Миграция и новый жизненный маршрут.</p></div>
        </div>
        <p className="flow-conclusion reveal">Естественная ротация есть всегда. Вопрос — <strong>откуда придёт следующий набор?</strong></p>
        <Image
          className="marketing-object"
          src="/kindergarten-marketing/assets/marketing-megaphone.png"
          alt=""
          aria-hidden="true"
          width={1536}
          height={1024}
          sizes="(max-width: 640px) 220px, 520px"
        />
      </section>

      <section id="story" className="story-shell" aria-label="Путь от видимости до договора">
        <div className="story-pin">
          <div className="visibility-control-gradient-run">
            <div className="visibility-control-gradient-run__field" aria-hidden="true" />

          <article className="story-panel visibility-panel">
            <span className="ghost-word" aria-hidden="true">ПЕРВЫМ</span>
            <div className="visibility-copy">
              <h2 className="display-title display-title--stacked">
                <span className="title-line">Новые семьи уходят к тем,</span>
                <span className="title-line">кого увидели первыми</span>
              </h2>
              <div className="visibility-copy__text">
                <p>Побеждает не всегда лучший сад. Часто побеждает тот, кто раньше попал в поле зрения родителей.</p>
                <p>У вас может быть сильное имя среди знакомых семей, но семьи после переезда просто о вас ещё не знают.</p>
              </div>
            </div>
            <div className="attention-flow" aria-label="Как новая семья выбирает сад, который увидела первым">
              <div className="attention-stage attention-stage--family">
                <span>01 / Новая семья</span>
                <strong>Переехала в район</strong>
                <p>Ищет сад и начинает с того, что видит в поиске и ленте.</p>
              </div>
              <span className="attention-arrow" aria-hidden="true">→</span>
              <div className="attention-stage attention-stage--first">
                <span>02 / Первое касание</span>
                <strong>Увидела конкурента</strong>
                <p>Его предложение первым стало знакомым и понятным.</p>
              </div>
              <span className="attention-arrow" aria-hidden="true">→</span>
              <div className="attention-stage attention-stage--choice">
                <span>03 / Выбор</span>
                <strong>Выбрала знакомый вариант</strong>
                <p>Не потому что он лучше — его просто увидели раньше.</p>
              </div>
              <div className="garden-missed">
                <div><span>Ваш сильный сад</span><b>10 мин рядом</b></div>
                <p>Новая семья может месяцами жить рядом с вашим садом и даже не знать, что вы существуете.</p>
                <strong>Не попал в поле зрения</strong>
              </div>
            </div>
            <p className="visibility-loss">Конкуренты забирают семьи, которые могли бы учиться у вас.</p>
          </article>

          <article id="control" className="story-panel control-panel">
            <h2 className="display-title">Instagram и рекомендации<br />не дают контроля</h2>
            <div className="control-compare">
              <div className="control-card control-card--have">
                <span className="control-card__index">01 / сейчас</span>
                <h3>Есть</h3>
                <div className="control-card__list"><p>Сайт и контент</p><p>Лайки</p><p>Репутация</p><p>Рекомендации</p></div>
              </div>
              <div className="control-card control-card--need">
                <span className="control-card__index">02 / для управляемого набора</span>
                <h3>Не хватает</h3>
                <div className="control-card__list"><p>Прогноза по договорам</p><p>Управляемого потока</p><p>Понимания бюджета</p></div>
              </div>
            </div>
            <p className="control-thesis">Лайки не заполняют группы. Рекомендации нельзя вызвать по плану.</p>
            <div className="budget-line"><span>+5 детей</span><span>+10 детей</span><strong>Сколько вложить в этом месяце?</strong></div>
          </article>
          </div>

          <article id="leads" className="story-panel leads-panel">
            <div className="leads-side leads-side--applications">
              <p>Проблема не в количестве заявок</p>
              <h2>Заявки</h2>
              <div className="application-grid">{Array.from({ length: 18 }, (_, i) => <ApplicationGlyph key={i} />)}</div>
              <span>Реклама даёт обращения, но не семьи, которые доходят до оплаты. Заявки есть, бюджет потрачен, а свободные места остаются.</span>
            </div>
            <div className="not-equal" aria-hidden="true">≠</div>
            <div className="leads-side leads-side--students">
              <h2>Новые ученики</h2>
              <div className="contract-grid">{Array.from({ length: 3 }, (_, i) => <ContractGlyph key={i} />)}</div>
              <span>Непонятно, какая часть рекламного бюджета привела к новым договорам.</span>
            </div>
          </article>

          <article id="journey" className="story-panel journey-panel">
            <svg className="contour-lines" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
              <path d="M-80 180 C240 20 420 310 710 130 S1250 0 1680 210" />
              <path d="M-60 330 C190 190 430 420 720 270 S1320 130 1690 340" />
              <path d="M-90 560 C300 360 520 650 850 470 S1320 370 1710 570" />
              <path d="M-70 760 C230 570 610 830 920 660 S1420 560 1700 750" />
            </svg>
            <div className="journey-head">
              <h2 className="display-title display-title--stacked">
                <span className="title-line">Где <em className="title-accent">теряются</em></span>
                <span className="title-line">родители?</span>
              </h2>
              <p>Родители пишут, спрашивают, приходят на экскурсии — но места всё равно пустуют.</p>
            </div>
            <div className="journey-map" aria-label="Этапы, на которых родители перестают двигаться к договору">
              {[
                { number: "01", title: "Пишут", text: "Новая семья начинает диалог.", loss: "Много обращений" },
                { number: "02", title: "Спрашивают", text: "Задают 20 вопросов — и исчезают.", loss: "Тишина после диалога" },
                { number: "03", title: "Приходят", text: "Знакомятся с садом на экскурсии.", loss: "Не все доходят до решения" },
                { number: "04", title: "Выбирают другой сад", text: "После долгого общения часть семей выбирает другой вариант.", loss: "Место остаётся пустым" },
              ].map(({ number, title, text, loss }) => (
                <div className="journey-stop" key={number}>
                  <b>{number}</b>
                  <div><h3>{title}</h3><p>{text}</p></div>
                  <span>{loss}</span>
                </div>
              ))}
            </div>
            <p className="journey-thesis">Подходящие семьи доходят до вас, но часть из них <strong>теряется до принятия решения.</strong></p>
          </article>

          <div className="transparency-value-gradient-run">
            <div className="transparency-value-gradient-run__field" aria-hidden="true" />

          <article id="transparency" className="story-panel transparency-panel">
            <h2 className="display-title display-title--stacked">
              <span className="title-line">Без прозрачности</span>
              <span className="title-line">набор становится</span>
              <span className="title-line"><em className="title-accent">надеждой</em></span>
            </h2>
            <p className="pipeline-question">Цель — 5 новых учеников. Но сколько заявок потребуется?</p>
            <p className="pipeline-warning">Без конверсий между этапами прогноз невозможен</p>
            <div className="pipeline">
              {["Заявки", "Диалоги", "Экскурсии", "Договоры"].map((stage, index) => (
                <div className="pipeline-stage" key={stage}>
                  <span>{stage}</span>
                  <b>{index === 3 ? "5" : "?"}</b>
                  <small>{index === 3 ? "цель" : "нет данных"}</small>
                </div>
              ))}
            </div>
            <div className="plus-five" aria-label="Цель — плюс пять детей">
              <Image
                className="plus-five-image"
                src="/kindergarten-marketing/assets/plus-five-3d.png"
                alt=""
                aria-hidden="true"
                width={1118}
                height={1455}
                sizes="(max-width: 640px) 54vw, 520px"
              />
            </div>
            <p className="pipeline-note">Администратор занят. Переписки идут. <strong>Но управлять можно только тем, что измеряется.</strong></p>
          </article>

      <section id="value" className="chapter value-section">
        <div className="value-head">
          <h2 className="display-title display-title--stacked">
            <span className="title-line">Родитель должен понять</span>
            <span className="title-line"><em className="title-accent">ценность</em></span>
            <span className="title-line">до первого сообщения</span>
          </h2>
          <div>
            <h3>Пока родитель не видит разницу, он сравнивает сады только по цене.</h3>
            <p>Сильная программа, педагоги и подход уже есть — но семья может узнать о них слишком поздно. Покажите ценность ещё до первого сообщения.</p>
          </div>
        </div>
        <div className="value-accordion" role="group" aria-label="Из чего складывается ценность сада">
          {pillars.map((pillar, index) => (
            <button
              type="button"
              key={pillar.title}
              className={activePillar === index ? "is-active" : ""}
              onMouseEnter={() => setActivePillar(index)}
              onFocus={() => setActivePillar(index)}
              onClick={() => setActivePillar(index)}
              aria-expanded={activePillar === index}
            >
              <span className="pillar-index">0{index + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </button>
          ))}
        </div>
      </section>
          </div>
        </div>
      </section>

      <section id="system" className="chapter system-section">
        <div className="system-top">
          <h2 className="display-title display-title--stacked">
            <span className="title-line">Система, которая</span>
            <span className="title-line">каждый месяц знакомит</span>
            <span className="title-line"><em className="title-accent">новые семьи</em> с вашим садом</span>
          </h2>
          <p>От первого касания — до экскурсии и договора.</p>
        </div>
        <div className="system-bottom">
          <ol className="system-journey">
            {journey.map((item, index) => <li key={item}><b>{String(index + 1).padStart(2, "0")}</b><span>{item}</span></li>)}
          </ol>
          <div className="setup-row">
            <h3>Что мы настроим</h3>
            <div>
              {setupItems.map(({ icon: Icon, label }) => (
                <span key={label}><Icon aria-hidden="true" /><small>{label}</small></span>
              ))}
            </div>
          </div>
          <div className="system-action">
            <div className="system-offer">
              <p><Gift aria-hidden="true" /> На бесплатном разборе покажем</p>
              <ul>
                <li>сколько детей можно добрать</li>
                <li>сколько оплат дадут +3, +5 или +10 детей</li>
                <li>где сейчас теряются родители</li>
                <li>сколько заявок и экскурсий потребуется</li>
                <li>какую систему запустить в вашем городе</li>
              </ul>
            </div>
            <CTAButton onClick={openLeadDialog}>Рассчитать потенциал дозагрузки сада</CTAButton>
          </div>
          <footer>
            <Brand />
            <p>© 2026. Система привлечения семей для русскоязычных детских садов.</p>
            <Link href="/privacy">Политика конфиденциальности</Link>
          </footer>
        </div>
      </section>

      <LeadDialog dialogRef={dialogRef} />
    </main>
  );
}
