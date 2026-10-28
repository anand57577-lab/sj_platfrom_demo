import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Route = "home" | "shop" | "product" | "wishlist" | "cart" | "checkout" | "success" | "orders" | "order" | "login" | "signup" | "verify" | "profile" | "admin-login" | "admin" | "admin-orders" | "admin-delivered" | "admin-products" | "admin-customers" | "admin-settings"

type Product = {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  description: string
  badge?: string
  custom?: boolean
  stock: number
  placement?: "Bestseller" | "New arrival" | "Both"
  active?: boolean
}

type CatalogContextValue = {
  catalog: Product[]
  setCatalog: React.Dispatch<React.SetStateAction<Product[]>>
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

function useCatalog() {
  const value = useContext(CatalogContext)
  if (!value) throw new Error("CatalogContext is unavailable")
  return value
}

const products: Product[] = [
  {
    id: 1,
    name: "Rani Kundan Bangle Set",
    category: "Traditional Bangles",
    price: 1899,
    oldPrice: 2399,
    rating: 4.9,
    reviews: 128,
    image:
      "https://images.unsplash.com/photo-1723361656145-b481be3f9e05?auto=format&fit=crop&w=900&q=85",
    description:
      "A regal handcrafted bangle set with kundan-inspired detailing and a rich antique-gold finish.",
    badge: "Bestseller",
    stock: 8,
  },
  {
    id: 2,
    name: "Meher Pearl Jhumkas",
    category: "Handmade Earrings",
    price: 849,
    oldPrice: 1099,
    rating: 4.8,
    reviews: 86,
    image:
      "https://images.unsplash.com/photo-1721807644561-9efcabee5c42?auto=format&fit=crop&w=900&q=85",
    description:
      "Lightweight festive earrings finished by hand with tiny pearl drops and intricate metalwork.",
    badge: "New",
    stock: 14,
  },
  {
    id: 3,
    name: "Pressed Bloom Keychain",
    category: "Resin Art",
    price: 399,
    rating: 4.7,
    reviews: 54,
    image:
      "https://images.unsplash.com/photo-1725826474457-d4dc3d6d8abf?auto=format&fit=crop&w=900&q=85",
    description:
      "Real pressed flowers preserved in crystal-clear resin, finished with a polished gold-tone clasp.",
    custom: true,
    stock: 21,
  },
  {
    id: 4,
    name: "Forever Bloom Photo Frame",
    category: "Personalised Gifts",
    price: 1299,
    oldPrice: 1599,
    rating: 4.9,
    reviews: 72,
    image:
      "https://images.unsplash.com/photo-1775780307681-3340157a1d26?auto=format&fit=crop&w=900&q=85",
    description:
      "A keepsake frame with preserved flowers, a treasured photo and a personalised message.",
    badge: "Made for you",
    custom: true,
    stock: 10,
  },
  {
    id: 5,
    name: "Noor Heritage Necklace",
    category: "Handmade Jewellery",
    price: 2499,
    oldPrice: 2999,
    rating: 4.8,
    reviews: 64,
    image:
      "https://images.unsplash.com/photo-1601121141499-17ae80afc03a?auto=format&fit=crop&w=900&q=85",
    description:
      "An heirloom-inspired statement necklace with carefully set stones and artisan beadwork.",
    badge: "Limited",
    stock: 4,
  },
  {
    id: 6,
    name: "Floral Initial Keepsake",
    category: "Personalised Gifts",
    price: 699,
    rating: 4.6,
    reviews: 41,
    image:
      "https://images.unsplash.com/photo-1741980983723-09c2051e8b1e?auto=format&fit=crop&w=900&q=85",
    description:
      "A bespoke floral initial crafted in resin, perfect for bags, keys and thoughtful gifting.",
    custom: true,
    stock: 18,
  },
  {
    id: 7,
    name: "Ziya Antique Kada",
    category: "Traditional Bangles",
    price: 1199,
    rating: 4.7,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1611598935678-c88dca238fce?auto=format&fit=crop&w=900&q=85",
    description:
      "A refined antique-finish kada with elegant stone detailing, made for effortless festive dressing.",
    stock: 6,
  },
  {
    id: 8,
    name: "Gul Dried Flower Pendant",
    category: "Resin Art",
    price: 549,
    rating: 4.8,
    reviews: 38,
    image:
      "https://images.unsplash.com/photo-1783509097964-3a1123132492?auto=format&fit=crop&w=900&q=85",
    description:
      "A one-of-a-kind botanical pendant preserving delicate flowers in luminous hand-poured resin.",
    badge: "One of a kind",
    stock: 11,
  },
]

const money = (value: number) => `₹${value.toLocaleString("en-IN")}`

function Icon({ name, size = 20 }: { name: string, size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    cart: (
      <>
        <path d="M3 3h2l2.4 11.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: <path d="M6 6l12 12M18 6 6 18" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    package: (
      <>
        <path d="m3 7 9 5 9-5-9-5-9 5Z" />
        <path d="m3 7 9 5v10l-9-5V7Zm18 0-9 5v10l9-5V7Z" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    orders: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M14 3h7v18h-7" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m0 0-4 4m4-4 4 4" />
        <path d="M4 15v5h16v-5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "ghost" | "icon" | "danger"
  icon?: string
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  )
}

function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  prefix,
}: {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  prefix?: string
}) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <div className="input-wrap">
        {prefix && <b>{prefix}</b>}
        <input
          aria-label={label || placeholder}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </label>
  )
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label?: string
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
}) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {children}
      </select>
    </label>
  )
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-mark">SJ</span>
      <span>
        <b>SJ Creations</b>
        <small>crafted with heart</small>
      </span>
    </div>
  )
}

function Header({
  route,
  go,
  cartCount,
  wishCount,
}: {
  route: Route
  go: (r: Route) => void
  cartCount: number
  wishCount: number
}) {
  const [menu, setMenu] = useState(false)
  const nav = [
    ["Home", "home"],
    ["Shop all", "shop"],
    ["Bangles", "shop"],
    ["Earrings", "shop"],
    ["Resin art", "shop"],
    ["Personalised gifts", "shop"],
  ] as [string, Route][]
  return (
    <>
      <div className="announcement">
        Complimentary delivery on orders above ₹1,499{" "}
        <span>Handcrafted in India</span>
      </div>
      <header className="header">
        <Button
          variant="ghost"
          className="mobile-menu"
          icon={menu ? "close" : "menu"}
          onClick={() => setMenu(!menu)}
        />
        <div onClick={() => go("home")} className="brand-click">
          <Brand />
        </div>
        <nav className={menu ? "nav open" : "nav"}>
          {nav.map(([label, r]) => (
            <Button
              key={label}
              variant="ghost"
              className={route === r ? "active" : ""}
              onClick={() => {
                go(r)
                setMenu(false)
              }}
            >
              {label}
            </Button>
          ))}
        </nav>
        <div className="header-actions">
          <Button variant="icon" icon="search" onClick={() => go("shop")} />
          <Button variant="icon" icon="heart" onClick={() => go("wishlist")}>
            <i>{wishCount || ""}</i>
          </Button>
          <Button variant="icon" icon="cart" onClick={() => go("cart")}>
            <i>{cartCount || ""}</i>
          </Button>
          <Button
            variant="ghost"
            className="account-link"
            icon="user"
            onClick={() => go("login")}
          >
            Sign in
          </Button>
        </div>
      </header>
    </>
  )
}

function SectionTitle({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow?: string
  title: string
  text?: string
  action?: () => void
}) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <div className="display-md">{title}</div>
        {text && <p>{text}</p>}
      </div>
      {action && (
        <Button variant="ghost" onClick={action}>
          View all <Icon name="arrow" />
        </Button>
      )}
    </div>
  )
}

function ProductCard({
  product,
  wish,
  onWish,
  onOpen,
  onCart,
}: {
  product: Product
  wish: boolean
  onWish: () => void
  onOpen: () => void
  onCart: () => void
}) {
  return (
    <article className="product-card">
      <div className="product-image" onClick={onOpen}>
        <img src={product.image} alt={product.name} />
        {product.badge && <span className="badge">{product.badge}</span>}
        <Button
          variant="icon"
          className={wish ? "wish active" : "wish"}
          icon="heart"
          onClick={onWish}
        />
        <div className="quick">Quick view</div>
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <div className="product-name" onClick={onOpen}>
          {product.name}
        </div>
        <div className="rating">
          <b>★ {product.rating}</b>
          <span>({product.reviews})</span>
        </div>
        <div className="card-bottom">
          <div className="price">
            <b>{money(product.price)}</b>
            {product.oldPrice && <del>{money(product.oldPrice)}</del>}
          </div>
          <Button variant="icon" icon="cart" onClick={onCart} />
        </div>
      </div>
    </article>
  )
}

function Home({ go, open, addCart, wishlist, toggleWish }: PageProps) {
  const { catalog } = useCatalog()
  const activeCatalog = catalog.filter((product) => product.active !== false)
  const configuredBestsellers = activeCatalog.filter(
    (product) =>
      product.placement === "Bestseller" || product.placement === "Both",
  )
  const configuredArrivals = activeCatalog.filter(
    (product) =>
      product.placement === "New arrival" || product.placement === "Both",
  )
  const bestsellers = configuredBestsellers.length
    ? configuredBestsellers
    : activeCatalog.slice(0, 4)
  const newArrivals = configuredArrivals.length
    ? configuredArrivals
    : activeCatalog.slice(4, 8)
  const customProduct =
    activeCatalog.find((product) => product.custom) || products[3]
  const categories = [
    [
      "Traditional Bangles",
      catalog.find((p) => p.category === "Traditional Bangles")?.image ||
        products[0].image,
    ],
    [
      "Handmade Earrings",
      catalog.find((p) => p.category === "Handmade Earrings")?.image ||
        products[1].image,
    ],
    [
      "Resin Keepsakes",
      catalog.find((p) => p.category === "Resin Art")?.image ||
        products[2].image,
    ],
    [
      "Personalised Gifts",
      catalog.find((p) => p.category === "Personalised Gifts")?.image ||
        products[3].image,
    ],
  ]
  return (
    <main>
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1716504628084-97224213ca6d?auto=format&fit=crop&w=1800&q=90"
          alt="Indian artisan jewellery styled for a celebration"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-kicker">
            Thoughtfully handmade · Uniquely yours
          </span>
          <div className="display-xl">
            Handmade with love.
            <br />
            <em>Made to be yours.</em>
          </div>
          <p>
            Discover heirloom-inspired jewellery and personalised keepsakes,
            shaped by hand for moments you’ll always remember.
          </p>
          <div className="hero-actions">
            <Button onClick={() => go("shop")}>
              Explore collection <Icon name="arrow" />
            </Button>
            <Button variant="secondary" onClick={() => open(customProduct)}>
              Discover custom gifts
            </Button>
          </div>
        </div>
        <div className="hero-note">
          <span>01</span>
          <div>
            <b>Made slowly, treasured forever</b>
            <small>Every piece carries the warmth of its maker.</small>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="Find your favourite"
          title="Shop by category"
          text="From festive finery to keepsakes made just for you."
        />
        <div className="category-grid">
          {categories.map(([name, image], index) => (
            <div
              className={`category-card c${index + 1}`}
              key={name}
              onClick={() => go("shop")}
            >
              <img src={image} alt="" />
              <div>
                <span>0{index + 1}</span>
                <b>{name}</b>
                <small>
                  Explore collection <Icon name="arrow" size={16} />
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section product-section">
        <SectionTitle
          eyebrow="Loved by you"
          title="Our bestsellers"
          text="The pieces our community returns to, time and again."
          action={() => go("shop")}
        />
        <div className="product-grid">
          {bestsellers.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wish={wishlist.includes(p.id)}
              onWish={() => toggleWish(p.id)}
              onOpen={() => open(p)}
              onCart={() => addCart(p.id)}
            />
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1612945578381-6481cdd73b0a?auto=format&fit=crop&w=1200&q=85"
            alt="Rich Indian craft textiles and jewellery"
          />
          <span>
            Hand-finished
            <br />
            with care
          </span>
        </div>
        <div className="story-copy">
          <span className="eyebrow">The SJ promise</span>
          <div className="display-lg">
            Crafted by hands.
            <br />
            Chosen by hearts.
          </div>
          <p>
            We believe meaningful things shouldn’t feel mass-made. Every SJ
            creation is thoughtfully designed, carefully finished, and packed
            with the same joy with which it was created.
          </p>
          <div className="promise-list">
            <div>
              <b>01</b>
              <span>
                <strong>Small-batch craft</strong>
                <small>Made in considered quantities, never rushed.</small>
              </span>
            </div>
            <div>
              <b>02</b>
              <span>
                <strong>Personal, always</strong>
                <small>Custom details that make your gift one of one.</small>
              </span>
            </div>
            <div>
              <b>03</b>
              <span>
                <strong>Warmly supported</strong>
                <small>Real help from selection to delivery.</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle
          eyebrow="Fresh from the studio"
          title="New arrivals"
          action={() => go("shop")}
        />
        <div className="product-grid">
          {newArrivals.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wish={wishlist.includes(p.id)}
              onWish={() => toggleWish(p.id)}
              onOpen={() => open(p)}
              onCart={() => addCart(p.id)}
            />
          ))}
        </div>
      </section>

      <section className="custom-banner">
        <div>
          <span className="eyebrow light">Your story, set in resin</span>
          <div className="display-lg">
            Some gifts can’t be
            <br />
            found. They’re made.
          </div>
          <p>
            Share your memory, message or idea — we’ll turn it into a keepsake
            made only for you.
          </p>
          <Button variant="secondary" onClick={() => open(customProduct)}>
            Start a custom order <Icon name="arrow" />
          </Button>
        </div>
        <img
          src={customProduct.image}
          alt="Personalised pressed flower photo frame"
        />
      </section>

      <section className="testimonials section">
        <SectionTitle
          eyebrow="Kind words"
          title="Made with love, received with joy"
        />
        <div className="quote-grid">
          <blockquote>
            “The bangles felt even more beautiful in person. The packaging was
            thoughtful and it arrived right on time for my sister’s wedding.”
            <footer>
              <b>Priya M.</b>
              <span>Verified customer · Pune</span>
            </footer>
          </blockquote>
          <blockquote>
            “I ordered a personalised resin frame for our anniversary. Every
            little detail was perfect — it truly felt one of a kind.”
            <footer>
              <b>Aditi S.</b>
              <span>Verified customer · Bengaluru</span>
            </footer>
          </blockquote>
          <blockquote>
            “From my first message to delivery, the experience was so warm. You
            can feel the care in every piece.”
            <footer>
              <b>Neha K.</b>
              <span>Verified customer · Jaipur</span>
            </footer>
          </blockquote>
        </div>
      </section>
    </main>
  )
}

type PageProps = {
  go: (route: Route) => void
  open: (product: Product) => void
  addCart: (id: number) => void
  wishlist: number[]
  toggleWish: (id: number) => void
}

function Shop({ open, addCart, wishlist, toggleWish }: PageProps) {
  const { catalog } = useCatalog()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("Featured")
  const result = useMemo(
    () =>
      catalog
        .filter((product) => product.active !== false)
        .filter(
          (p) =>
            (category === "All" || p.category === category) &&
            `${p.name} ${p.category}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "Price: low to high"
            ? a.price - b.price
            : sort === "Price: high to low"
              ? b.price - a.price
              : b.rating - a.rating,
        ),
    [catalog, query, category, sort],
  )
  const cats = [
    "All",
    "Traditional Bangles",
    "Handmade Earrings",
    "Resin Art",
    "Personalised Gifts",
    "Handmade Jewellery",
  ]
  return (
    <main className="page">
      <div className="shop-hero">
        <span className="eyebrow">The collection</span>
        <div className="display-lg">Made by hand, chosen by you.</div>
        <p>
          Discover jewellery and keepsakes made to bring a little more meaning
          to every day.
        </p>
      </div>
      <div className="shop-toolbar">
        <div className="search-box">
          <Icon name="search" />
          <input
            aria-label="Search products"
            placeholder="Search creations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={sort} onChange={setSort}>
          <option>Featured</option>
          <option>Price: low to high</option>
          <option>Price: high to low</option>
        </Select>
      </div>
      <div className="chips">
        {cats.map((c) => (
          <Button
            key={c}
            variant={category === c ? "primary" : "secondary"}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>
      <div className="results-line">
        <b>{result.length} creations</b>
        <span>Thoughtfully made in small batches</span>
      </div>
      {result.length ? (
        <div className="product-grid shop-grid">
          {result.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wish={wishlist.includes(p.id)}
              onWish={() => toggleWish(p.id)}
              onOpen={() => open(p)}
              onCart={() => addCart(p.id)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="No creations found"
          text="Try a different search or clear your filters."
          action={() => {
            setQuery("")
            setCategory("All")
          }}
          actionText="Clear filters"
        />
      )}
    </main>
  )
}

function ProductDetail({
  product,
  go,
  addCart,
  wishlist,
  toggleWish,
}: PageProps & { product: Product }) {
  const { catalog } = useCatalog()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState("Story & details")
  return (
    <main className="page">
      <div className="breadcrumbs">
        <Button variant="ghost" onClick={() => go("home")}>
          Home
        </Button>
        <Icon name="chevron" size={14} />
        <Button variant="ghost" onClick={() => go("shop")}>
          {product.category}
        </Button>
        <Icon name="chevron" size={14} />
        <span>{product.name}</span>
      </div>
      <div className="detail-grid">
        <div className="gallery">
          <div className="thumbs">
            {[
              product.image,
              catalog[(product.id + 1) % catalog.length]?.image ||
                product.image,
              catalog[(product.id + 3) % catalog.length]?.image ||
                product.image,
            ].map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
          <div className="main-image">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="badge">{product.badge}</span>}
          </div>
        </div>
        <div className="detail-info">
          <span className="eyebrow">{product.category}</span>
          <div className="display-lg">{product.name}</div>
          <div className="detail-rating">
            <span>★ {product.rating}</span>
            <b>{product.reviews} reviews</b>
            <small>Handmade in India</small>
          </div>
          <div className="detail-price">
            {money(product.price)}{" "}
            {product.oldPrice && (
              <>
                <del>{money(product.oldPrice)}</del>
                <span>Save {money(product.oldPrice - product.price)}</span>
              </>
            )}
          </div>
          <p>{product.description}</p>
          <div className="option">
            <b>Choose your finish</b>
            <div className="swatches">
              <Button variant="secondary">Antique gold</Button>
              <Button variant="secondary">Rose gold</Button>
              <Button variant="secondary">Silver</Button>
            </div>
          </div>
          {product.custom && (
            <div className="personalise">
              <b>Make it personal</b>
              <p>Add a name or a short message (prototype preview only).</p>
              <Field placeholder="e.g. Always & forever" />
              <Button variant="secondary" icon="upload">
                Add your photo
              </Button>
            </div>
          )}
          <div className="buy-row">
            <div className="qty">
              <Button
                variant="icon"
                icon="minus"
                onClick={() => setQty(Math.max(1, qty - 1))}
              />
              <b>{qty}</b>
              <Button
                variant="icon"
                icon="plus"
                onClick={() => setQty(qty + 1)}
              />
            </div>
            <Button
              className="wide"
              icon="cart"
              onClick={() => addCart(product.id)}
            >
              Add to bag
            </Button>
            <Button
              variant="icon"
              className={wishlist.includes(product.id) ? "active" : ""}
              icon="heart"
              onClick={() => toggleWish(product.id)}
            />
          </div>
          <Button
            variant="secondary"
            className="full"
            onClick={() => {
              addCart(product.id)
              go("checkout")
            }}
          >
            Buy it now
          </Button>
          <div className="delivery-box">
            <Icon name="package" />
            <div>
              <b>Estimated delivery</b>
              <span>8–12 business days · Made in small batches</span>
            </div>
          </div>
        </div>
      </div>
      <div className="tabs">
        {["Story & details", "Care guide", "Delivery & returns"].map((t) => (
          <Button
            key={t}
            variant="ghost"
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <div className="tab-content">
        <div className="display-sm">{tab}</div>
        <p>
          {tab === "Story & details"
            ? "Each piece is shaped and finished by hand using carefully selected materials. Subtle variations are part of its character — a quiet signature of the artisan who made it."
            : tab === "Care guide"
              ? "Store your creation in a dry place, away from perfume and direct moisture. Wipe gently with a soft cloth after wear."
              : "This made-to-order piece usually dispatches within 5–7 days. Easy replacement is available for items damaged in transit."}
        </p>
      </div>
    </main>
  )
}

function Empty({
  title,
  text,
  action,
  actionText,
}: {
  title: string
  text: string
  action: () => void
  actionText: string
}) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon name="heart" size={32} />
      </div>
      <div className="display-sm">{title}</div>
      <p>{text}</p>
      <Button onClick={action}>{actionText}</Button>
    </div>
  )
}

function Wishlist({
  ids,
  go,
  open,
  addCart,
  toggleWish,
}: { ids: number[] } & PageProps) {
  const { catalog } = useCatalog()
  const list = catalog.filter((p) => ids.includes(p.id))
  return (
    <main className="page narrow-page">
      <SectionTitle
        eyebrow="Saved for later"
        title="Your wishlist"
        text={`${list.length} ${
          list.length === 1 ? "creation" : "creations"
        } waiting for you.`}
      />
      {list.length ? (
        <div className="product-grid">
          {list.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wish
              onWish={() => toggleWish(p.id)}
              onOpen={() => open(p)}
              onCart={() => addCart(p.id)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="Your wishlist is waiting"
          text="Save the pieces that speak to you, and find them here anytime."
          action={() => go("shop")}
          actionText="Explore creations"
        />
      )}
    </main>
  )
}

function Cart({
  cart,
  setCart,
  go,
  open,
}: {
  cart: Record<number, number>
  setCart: React.Dispatch<React.SetStateAction<Record<number, number>>>
  go: (r: Route) => void
  open: (p: Product) => void
}) {
  const { catalog } = useCatalog()
  const items = catalog.filter((p) => cart[p.id])
  const total = items.reduce((sum, p) => sum + p.price * cart[p.id], 0)
  const change = (id: number, delta: number) =>
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }))
  if (!items.length)
    return (
      <main className="page">
        <Empty
          title="Your bag feels a little light"
          text="Beautiful handmade things are just a browse away."
          action={() => go("shop")}
          actionText="Explore the collection"
        />
      </main>
    )
  return (
    <main className="page">
      <SectionTitle
        eyebrow="Your selection"
        title="Shopping bag"
        text="Review your handcrafted finds before you continue."
      />
      <div className="cart-layout">
        <div className="cart-list">
          {items.map((p) => (
            <div className="cart-item" key={p.id}>
              <img src={p.image} alt={p.name} onClick={() => open(p)} />
              <div className="cart-copy">
                <span>{p.category}</span>
                <b>{p.name}</b>
                <small>Finish: Antique gold</small>
                {p.custom && <small>Personalisation added</small>}
                <div className="cart-actions">
                  <div className="qty">
                    <Button
                      variant="icon"
                      icon="minus"
                      onClick={() => change(p.id, -1)}
                    />
                    <b>{cart[p.id]}</b>
                    <Button
                      variant="icon"
                      icon="plus"
                      onClick={() => change(p.id, 1)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setCart((prev) => ({ ...prev, [p.id]: 0 }))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
              <strong>{money(p.price * cart[p.id])}</strong>
            </div>
          ))}
        </div>
        <aside className="summary">
          <div className="display-sm">Order summary</div>
          <div>
            <span>Subtotal</span>
            <b>{money(total)}</b>
          </div>
          <div>
            <span>Delivery</span>
            <b>{total >= 1499 ? "Complimentary" : "₹99"}</b>
          </div>
          {total < 1499 && (
            <small>
              Add {money(1499 - total)} more for complimentary delivery.
            </small>
          )}
          <hr />
          <div className="total">
            <span>Total</span>
            <b>{money(total + (total >= 1499 ? 0 : 99))}</b>
          </div>
          <Button className="full" onClick={() => go("checkout")}>
            Proceed to order <Icon name="arrow" />
          </Button>
          <Button variant="ghost" className="full" onClick={() => go("shop")}>
            Continue shopping
          </Button>
          <p>
            Taxes included. Final delivery timing will be confirmed by the
            seller.
          </p>
        </aside>
      </div>
    </main>
  )
}

function Checkout({
  cart,
  go,
}: {
  cart: Record<number, number>
  go: (r: Route) => void
}) {
  const { catalog } = useCatalog()
  const items = catalog.filter((p) => cart[p.id])
  const total = items.reduce((sum, p) => sum + p.price * cart[p.id], 0)
  const [payment, setPayment] = useState("seller")
  return (
    <main className="page checkout-page">
      <SectionTitle
        eyebrow="Almost yours"
        title="Complete your order"
        text="No online payment is collected in this prototype."
      />
      <div className="checkout-layout">
        <div className="checkout-main">
          <section className="checkout-block">
            <div className="step-title">
              <span>1</span>
              <div>
                <b>Delivery address</b>
                <small>Where should we send your creations?</small>
              </div>
            </div>
            <label className="address-card selected">
              <input type="radio" checked readOnly />
              <div>
                <b>
                  Priya Sharma <em>Default</em>
                </b>
                <p>
                  24, Gulmohar Enclave, Baner Road
                  <br />
                  Pune, Maharashtra 411045
                </p>
                <small>+91 98765 43210</small>
              </div>
              <Button variant="ghost">Edit</Button>
            </label>
            <Button variant="secondary" icon="plus">
              Add a new address
            </Button>
          </section>
          <section className="checkout-block">
            <div className="step-title">
              <span>2</span>
              <div>
                <b>Your items</b>
                <small>
                  {items.length} handcrafted{" "}
                  {items.length === 1 ? "piece" : "pieces"}
                </small>
              </div>
            </div>
            {items.map((p) => (
              <div className="checkout-item" key={p.id}>
                <img src={p.image} alt="" />
                <div>
                  <b>{p.name}</b>
                  <span>Qty: {cart[p.id]} · Antique gold</span>
                </div>
                <strong>{money(p.price * cart[p.id])}</strong>
              </div>
            ))}
          </section>
          <section className="checkout-block">
            <div className="step-title">
              <span>3</span>
              <div>
                <b>Payment preference</b>
                <small>Payment is arranged directly with SJ Creations.</small>
              </div>
            </div>
            <label
              className={`payment-option ${
                payment === "seller" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === "seller"}
                onChange={() => setPayment("seller")}
              />
              <div>
                <b>Pay after seller confirmation</b>
                <p>
                  We’ll contact you on your registered mobile number to confirm
                  your order and arrange payment.
                </p>
              </div>
            </label>
            <label
              className={`payment-option ${
                payment === "upi" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={payment === "upi"}
                onChange={() => setPayment("upi")}
              />
              <div>
                <b>UPI via seller’s official QR</b>
                <p>
                  The official payment QR will be shared after the seller
                  confirms availability.
                </p>
                {payment === "upi" && (
                  <div className="qr-placeholder">
                    Official UPI QR
                    <br />
                    <small>Seller-provided placeholder</small>
                  </div>
                )}
              </div>
            </label>
          </section>
        </div>
        <aside className="summary sticky">
          <div className="display-sm">Order total</div>
          <div>
            <span>Subtotal</span>
            <b>{money(total)}</b>
          </div>
          <div>
            <span>Delivery</span>
            <b>Complimentary</b>
          </div>
          <hr />
          <div className="total">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
          <Button className="full" onClick={() => go("success")}>
            Place order <Icon name="arrow" />
          </Button>
          <p>
            By placing this order, you agree that the seller will contact you to
            confirm availability and payment arrangements.
          </p>
        </aside>
      </div>
    </main>
  )
}

function OrderSuccess({ go }: { go: (r: Route) => void }) {
  return (
    <main className="success-page">
      <div className="success-mark">
        <Icon name="check" size={42} />
      </div>
      <span className="eyebrow">Order received</span>
      <div className="display-lg">Thank you, Priya.</div>
      <p>
        Your order has been shared with SJ Creations. The seller will contact
        you shortly to confirm the details and payment arrangement.
      </p>
      <div className="order-number">
        <span>Order number</span>
        <b>SJC-240518</b>
        <small>18 May 2025</small>
      </div>
      <div className="status-callout">
        <span className="status pending">Awaiting seller confirmation</span>
        <p>No payment has been collected yet.</p>
      </div>
      <div className="success-actions">
        <Button onClick={() => go("orders")}>View my orders</Button>
        <Button variant="secondary" onClick={() => go("shop")}>
          Continue shopping
        </Button>
      </div>
    </main>
  )
}

const mockOrders = [
  {
    id: "SJC-240518",
    date: "18 May 2025",
    product: products[0],
    total: 2748,
    status: "Pending confirmation",
  },
  {
    id: "SJC-240402",
    date: "02 Apr 2025",
    product: products[3],
    total: 1299,
    status: "Shipped",
  },
  {
    id: "SJC-231214",
    date: "14 Dec 2024",
    product: products[1],
    total: 1698,
    status: "Delivered",
  },
]

function Orders({ go }: { go: (r: Route) => void }) {
  const [tab, setTab] = useState("All orders")
  const shown =
    tab === "All orders"
      ? mockOrders
      : mockOrders.filter((o) => o.status === tab)
  return (
    <main className="page narrow-page">
      <SectionTitle
        eyebrow="Your purchases"
        title="My orders"
        text="Follow every creation from our hands to your home."
      />
      <div className="tabs order-tabs">
        {["All orders", "Pending confirmation", "Shipped", "Delivered"].map(
          (t) => (
            <Button
              key={t}
              variant="ghost"
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ),
        )}
      </div>
      <div className="order-list">
        {shown.map((o) => (
          <div className="order-card" key={o.id}>
            <div className="order-head">
              <div>
                <span>Order {o.id}</span>
                <small>Placed on {o.date}</small>
              </div>
              <span
                className={`status ${o.status.toLowerCase().split(" ")[0]}`}
              >
                {o.status}
              </span>
            </div>
            <div className="order-body">
              <img src={o.product.image} alt="" />
              <div>
                <b>{o.product.name}</b>
                <span>+ 1 more handcrafted item</span>
              </div>
              <strong>{money(o.total)}</strong>
              <Button variant="secondary" onClick={() => go("order")}>
                View details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

function OrderDetail({ go }: { go: (r: Route) => void }) {
  return (
    <main className="page narrow-page">
      <div className="breadcrumbs">
        <Button variant="ghost" onClick={() => go("orders")}>
          My orders
        </Button>
        <Icon name="chevron" size={14} />
        <span>SJC-240518</span>
      </div>
      <SectionTitle
        eyebrow="Order SJC-240518"
        title="Awaiting confirmation"
        text="Placed on 18 May 2025"
      />
      <div className="tracking">
        <div className="track-step done">
          <i>
            <Icon name="check" />
          </i>
          <b>Order placed</b>
          <span>18 May · 10:42 AM</span>
        </div>
        <div className="track-step current">
          <i>2</i>
          <b>Seller confirmation</b>
          <span>We’ll update you shortly</span>
        </div>
        <div className="track-step">
          <i>3</i>
          <b>Processing</b>
          <span>Not started</span>
        </div>
        <div className="track-step">
          <i>4</i>
          <b>Shipped</b>
          <span>Not started</span>
        </div>
        <div className="track-step">
          <i>5</i>
          <b>Delivered</b>
          <span>Not started</span>
        </div>
      </div>
      <div className="order-detail-grid">
        <section className="checkout-block">
          <div className="display-sm">Items in your order</div>
          {mockOrders.slice(0, 2).map((o) => (
            <div className="checkout-item" key={o.id}>
              <img src={o.product.image} alt="" />
              <div>
                <b>{o.product.name}</b>
                <span>Qty: 1 · Antique gold</span>
              </div>
              <strong>{money(o.product.price)}</strong>
            </div>
          ))}
        </section>
        <section className="checkout-block">
          <div className="display-sm">Delivery details</div>
          <p>
            <b>Priya Sharma</b>
            <br />
            24, Gulmohar Enclave, Baner Road
            <br />
            Pune, Maharashtra 411045
            <br />
            +91 98765 43210
          </p>
          <hr />
          <b>Payment</b>
          <p>
            Pay after seller confirmation
            <br />
            <span className="status pending">Payment pending</span>
          </p>
        </section>
      </div>
    </main>
  )
}

function Auth({
  mode,
  go,
}: {
  mode: "login" | "signup"
  go: (r: Route) => void
}) {
  const [loading, setLoading] = useState(false)
  const submit = () => {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      go(mode === "signup" ? "verify" : "profile")
    }, 650)
  }
  return (
    <main className="auth-page">
      <div className="auth-art">
        <img
          src="https://images.unsplash.com/photo-1653227908236-36813ab5c30a?auto=format&fit=crop&w=1200&q=85"
          alt="Handcrafted gold jewellery"
        />
        <div>
          <Brand light />
          <blockquote>
            “Beautiful things become meaningful when they carry a story.”
          </blockquote>
          <span>Made with care · Made for you</span>
        </div>
      </div>
      <div className="auth-form">
        <Button variant="ghost" onClick={() => go("home")}>
          ← Back to home
        </Button>
        <div className="auth-inner">
          <span className="eyebrow">
            {mode === "login" ? "Welcome back" : "Join our little world"}
          </span>
          <div className="display-lg">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </div>
          <p>
            {mode === "login"
              ? "Your favourites, orders and beautiful finds are waiting."
              : "Save favourites, follow orders and make every gift personal."}
          </p>
          {mode === "signup" && (
            <Field label="Full name" placeholder="Your full name" />
          )}
          <Field
            label="Email address"
            placeholder="you@example.com"
            type="email"
          />
          <Field
            label="Password"
            placeholder="At least 8 characters"
            type="password"
          />
          {mode === "signup" && (
            <Field
              label="Confirm password"
              placeholder="Re-enter your password"
              type="password"
            />
          )}
          <Button className="full" onClick={submit} disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}{" "}
            {!loading && <Icon name="arrow" />}
          </Button>
          <div className="divider">
            <span>or</span>
          </div>
          <Button variant="secondary" className="full">
            G&nbsp;&nbsp; Continue with Google
          </Button>
          <p className="auth-switch">
            {mode === "login"
              ? "New to SJ Creations?"
              : "Already have an account?"}{" "}
            <Button
              variant="ghost"
              onClick={() => go(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </Button>
          </p>
          <small className="prototype-note">
            Prototype only — no real authentication or account creation occurs.
          </small>
        </div>
      </div>
    </main>
  )
}

function Verify({ go }: { go: (r: Route) => void }) {
  return (
    <main className="simple-form">
      <Brand />
      <div className="mail-icon">✉</div>
      <span className="eyebrow">One quick step</span>
      <div className="display-md">Verify your email</div>
      <p>
        Enter the 6-digit code shown in this prototype for
        <br />
        <b>p••••@gmail.com</b>
      </p>
      <div className="code-row">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <input
            key={n}
            aria-label={`Digit ${n}`}
            maxLength={1}
            defaultValue={n === 1 ? "2" : ""}
          />
        ))}
      </div>
      <Button onClick={() => go("profile")}>Verify email</Button>
      <small>Demo code only · Resend available in 00:42</small>
    </main>
  )
}

function Profile({ go }: { go: (r: Route) => void }) {
  return (
    <main className="page profile-page">
      <div className="progress-head">
        <Brand />
        <span>Profile setup · 75% complete</span>
      </div>
      <div className="progress">
        <i />
      </div>
      <div className="profile-intro">
        <span className="eyebrow">Just the essentials</span>
        <div className="display-lg">
          Where should we send the lovely things?
        </div>
        <p>Add your delivery details once for a smoother checkout next time.</p>
      </div>
      <div className="profile-form">
        <Field label="Full name" value="Priya Sharma" />
        <Field label="Email address · Verified" value="priya@gmail.com" />
        <Field label="Mobile number" prefix="+91" placeholder="98765 43210" />
        <Field
          label="Alternate mobile · Optional"
          prefix="+91"
          placeholder="Optional"
        />
        <Field
          label="Address line 1"
          placeholder="House / flat number, street"
        />
        <Field label="Address line 2" placeholder="Area / locality" />
        <Field label="City" placeholder="City" />
        <Select label="State">
          <option>Maharashtra</option>
          <option>Rajasthan</option>
          <option>Karnataka</option>
        </Select>
        <Field label="PIN code" placeholder="6-digit PIN code" />
        <Field label="Landmark · Optional" placeholder="Nearby landmark" />
      </div>
      <label className="check-row">
        <input type="checkbox" defaultChecked /> Make this my default delivery
        address
      </label>
      <Button onClick={() => go("home")}>
        Save and continue <Icon name="arrow" />
      </Button>
    </main>
  )
}

function Footer({ go }: { go: (r: Route) => void }) {
  return (
    <footer className="footer">
      <div className="newsletter">
        <div>
          <span className="eyebrow light">Letters from the studio</span>
          <div className="display-md">New creations, thoughtful stories.</div>
        </div>
        <div className="newsletter-form">
          <input
            aria-label="Email for newsletter"
            placeholder="Your email address"
          />
          <Button variant="secondary">Join the list</Button>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <Brand light />
          <p>
            Handmade jewellery and meaningful gifts, crafted in India with
            patience and heart.
          </p>
        </div>
        <div>
          <b>Shop</b>
          <Button variant="ghost" onClick={() => go("shop")}>
            All creations
          </Button>
          <Button variant="ghost">Bangles</Button>
          <Button variant="ghost">Earrings</Button>
          <Button variant="ghost">Personalised gifts</Button>
        </div>
        <div>
          <b>Help</b>
          <Button variant="ghost">Contact us</Button>
          <Button variant="ghost">Delivery & returns</Button>
          <Button variant="ghost">Care guide</Button>
          <Button variant="ghost">FAQs</Button>
        </div>
        <div>
          <b>Come say hello</b>
          <span>hello@sjcreations.in</span>
          <span>+91 98765 43210</span>
          <span>Mon–Sat · 10 AM–6 PM</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 SJ Creations. All rights reserved.</span>
        <span>Instagram · Pinterest · Facebook</span>
      </div>
    </footer>
  )
}

type AdminRoute = "admin" | "admin-orders" | "admin-delivered" | "admin-products" | "admin-customers" | "admin-settings"

function AdminShell({
  route,
  go,
  children,
}: {
  route: AdminRoute
  go: (r: Route) => void
  children: React.ReactNode
}) {
  const links: [AdminRoute, string, string][] = [
    ["admin", "grid", "Overview"],
    ["admin-orders", "orders", "Orders"],
    ["admin-delivered", "package", "Delivered"],
    ["admin-products", "cart", "Products"],
    ["admin-customers", "user", "Customers"],
    ["admin-settings", "grid", "Store settings"],
  ]
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <Brand light />
        <nav>
          {links.map(([r, icon, label]) => (
            <Button
              key={r}
              variant="ghost"
              className={route === r ? "active" : ""}
              icon={icon}
              onClick={() => go(r)}
            >
              {label}
            </Button>
          ))}
        </nav>
        <div className="admin-user">
          <span>SK</span>
          <div>
            <b>Sakshi Kumar</b>
            <small>Store owner</small>
          </div>
          <Button
            variant="icon"
            icon="logout"
            onClick={() => go("admin-login")}
          />
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <div>
            <b>{links.find((l) => l[0] === route)?.[2]}</b>
            <span>Sunday, 18 May 2025</span>
          </div>
          <div>
            <div className="admin-search">
              <Icon name="search" />
              <input
                aria-label="Admin search"
                placeholder="Search anything..."
              />
            </div>
            <Button variant="icon" icon="bell" />
            <div className="avatar">SK</div>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}

const adminOrders = [
  {
    id: "SJC-240518",
    customer: "Priya Sharma",
    product: "Rani Bangle Set +1",
    total: 2748,
    payment: "Pending",
    status: "Pending confirmation",
    date: "18 May 2025",
  },
  {
    id: "SJC-240517",
    customer: "Riya Mehta",
    product: "Forever Bloom Frame",
    total: 1299,
    payment: "Received",
    status: "Processing",
    date: "17 May 2025",
  },
  {
    id: "SJC-240514",
    customer: "Ananya Iyer",
    product: "Meher Pearl Jhumkas",
    total: 849,
    payment: "Received",
    status: "Shipped",
    date: "14 May 2025",
  },
  {
    id: "SJC-240402",
    customer: "Neha Kapoor",
    product: "Floral Initial Keepsake",
    total: 699,
    payment: "Received",
    status: "Delivered",
    date: "02 Apr 2025",
  },
]

function AdminLogin({ go }: { go: (r: Route) => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <Brand />
        <span className="admin-tag">STORE ADMINISTRATION</span>
        <div className="display-md">Welcome back</div>
        <p>Sign in to manage SJ Creations.</p>
        <Field label="Admin email or username" placeholder="Enter your email" />
        <Field
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Button
          className="full"
          onClick={() => {
            setLoading(true)
            window.setTimeout(() => go("admin"), 500)
          }}
        >
          {loading ? "Signing in…" : "Sign in securely"}
        </Button>
        <Button variant="ghost">Forgot password?</Button>
        <small>
          Private prototype route. Production security requires backend
          authentication and authorisation.
        </small>
      </div>
    </main>
  )
}

function AdminDashboard({ go }: { go: (r: Route) => void }) {
  const metrics = [
    ["Total orders", "248", "+12.5%", "orders"],
    ["Pending orders", "18", "Needs attention", "package"],
    ["Total customers", "186", "+8 this month", "user"],
    ["Total order value", "₹3.84L", "Not verified revenue", "grid"],
  ]
  return (
    <AdminShell route="admin" go={go}>
      <div className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Store overview</span>
            <div className="display-md">Good morning, Sakshi.</div>
            <p>Here’s what’s happening with your store today.</p>
          </div>
          <Select>
            <option>Last 30 days</option>
            <option>This quarter</option>
          </Select>
        </div>
        <div className="metrics">
          {metrics.map(([label, value, note, icon]) => (
            <div className="metric" key={label}>
              <div>
                <span>{label}</span>
                <Icon name={icon} />
              </div>
              <b>{value}</b>
              <small>{note}</small>
            </div>
          ))}
        </div>
        <div className="dashboard-grid">
          <section className="chart-card">
            <div className="card-head">
              <div>
                <b>Orders over time</b>
                <span>Last 30 days</span>
              </div>
              <b>84 orders</b>
            </div>
            <div className="chart">
              <div style={{ height: "34%" }} />
              <div style={{ height: "56%" }} />
              <div style={{ height: "44%" }} />
              <div style={{ height: "72%" }} />
              <div style={{ height: "62%" }} />
              <div style={{ height: "88%" }} />
              <div style={{ height: "76%" }} />
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </section>
          <section className="chart-card">
            <div className="card-head">
              <div>
                <b>Order status</b>
                <span>Current distribution</span>
              </div>
            </div>
            <div className="donut-wrap">
              <div className="donut">
                <b>248</b>
                <span>orders</span>
              </div>
              <div className="legend">
                <span>
                  <i className="burgundy" />
                  Delivered <b>58%</b>
                </span>
                <span>
                  <i className="gold" />
                  Processing <b>24%</b>
                </span>
                <span>
                  <i className="rose" />
                  Pending <b>18%</b>
                </span>
              </div>
            </div>
          </section>
        </div>
        <section className="admin-table-card">
          <div className="card-head">
            <div>
              <b>Recent orders</b>
              <span>Latest customer activity</span>
            </div>
            <Button variant="secondary" onClick={() => go("admin-orders")}>
              View all orders
            </Button>
          </div>
          <OrderTable orders={adminOrders.slice(0, 3)} />
        </section>
      </div>
    </AdminShell>
  )
}

function OrderTable({
  orders,
  onStatus,
}: {
  orders: typeof adminOrders
  onStatus?: (id: string) => void
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product summary</th>
            <th>Order value</th>
            <th>Payment</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <b>{o.id}</b>
                <small>{o.date}</small>
              </td>
              <td>{o.customer}</td>
              <td>{o.product}</td>
              <td>
                <b>{money(o.total)}</b>
              </td>
              <td>
                <span className={`status ${o.payment.toLowerCase()}`}>
                  {o.payment}
                </span>
              </td>
              <td>
                <span
                  className={`status ${o.status.toLowerCase().split(" ")[0]}`}
                >
                  {o.status}
                </span>
              </td>
              <td>
                <Button
                  variant="icon"
                  icon="chevron"
                  onClick={() => onStatus?.(o.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AdminOrders({
  delivered = false,
  go,
  status,
  setStatus,
}: {
  delivered?: boolean
  go: (r: Route) => void
  status: Record<string, string>
  setStatus: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const current = adminOrders.map((o) => ({
    ...o,
    status: status[o.id] || o.status,
  }))
  const rows = delivered
    ? current.filter((o) => o.status === "Delivered")
    : current
  const update = (id: string) =>
    setStatus((prev) => ({
      ...prev,
      [id]:
        (prev[id] || adminOrders.find((o) => o.id === id)?.status) ===
        "Delivered"
          ? "Processing"
          : "Delivered",
    }))
  return (
    <AdminShell route={delivered ? "admin-delivered" : "admin-orders"} go={go}>
      <div className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">
              {delivered ? "Delivery history" : "Order management"}
            </span>
            <div className="display-md">
              {delivered ? "Delivered orders" : "All orders"}
            </div>
            <p>
              {delivered
                ? "A complete record of successfully delivered orders."
                : "Review, confirm and update customer orders."}
            </p>
          </div>
          <Button>Export records</Button>
        </div>
        <div className="admin-filters">
          <div className="admin-search">
            <Icon name="search" />
            <input
              aria-label="Search orders"
              placeholder="Search order ID or customer..."
            />
          </div>
          <Select>
            <option>All statuses</option>
            <option>Pending confirmation</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </Select>
          <Select>
            <option>All payment statuses</option>
            <option>Pending</option>
            <option>Received</option>
          </Select>
        </div>
        <section className="admin-table-card">
          <OrderTable orders={rows} onStatus={update} />
        </section>
        <div className="admin-hint">
          Select an order arrow to toggle its prototype status between
          Processing and Delivered.
        </div>
      </div>
    </AdminShell>
  )
}

function AdminProducts({ go }: { go: (r: Route) => void }) {
  const { catalog, setCatalog } = useCatalog()
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const blankProduct: Product = {
    id: 0,
    name: "",
    category: "Traditional Bangles",
    price: 0,
    rating: 5,
    reviews: 0,
    image: products[0].image,
    description: "",
    stock: 1,
    placement: "New arrival",
    active: true,
    custom: false,
  }
  const [draft, setDraft] = useState<Product>(blankProduct)
  const updateDraft = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((current) => ({ ...current, [key]: value }))
  const openAdd = () => {
    setEditingId(null)
    setDraft(blankProduct)
    setModal(true)
  }
  const openEdit = (product: Product) => {
    setEditingId(product.id)
    setDraft({ ...product })
    setModal(true)
  }
  const saveProduct = () => {
    if (!draft.name.trim() || draft.price <= 0) return
    if (editingId) {
      setCatalog((current) =>
        current.map((product) =>
          product.id === editingId ? { ...draft, id: editingId } : product,
        ),
      )
    } else {
      const nextId = Math.max(0, ...catalog.map((product) => product.id)) + 1
      setCatalog((current) => [...current, { ...draft, id: nextId }])
    }
    setModal(false)
  }
  const deleteProduct = (product: Product) => {
    if (
      window.confirm(
        `Delete "${product.name}"? This will also remove it from the storefront for this prototype session.`,
      )
    ) {
      setCatalog((current) => current.filter((item) => item.id !== product.id))
    }
  }

  return (
    <AdminShell route="admin-products" go={go}>
      <div className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Catalogue</span>
            <div className="display-md">Products</div>
            <p>
              {catalog.length} products ·{" "}
              {catalog.filter((product) => product.stock < 6).length} low in
              stock
            </p>
          </div>
          <Button icon="plus" onClick={openAdd}>
            Add product
          </Button>
        </div>
        <div className="admin-products">
          {catalog.map((p) => (
            <div className="admin-product" key={p.id}>
              <img src={p.image} alt="" />
              <div>
                <b>{p.name}</b>
                <span>{p.category}</span>
              </div>
              <strong>{money(p.price)}</strong>
              <span className={p.stock < 6 ? "stock low" : "stock"}>
                {p.stock} in stock
              </span>
              <span
                className={`status ${
                  p.active === false ? "cancelled" : "delivered"
                }`}
              >
                {p.active === false ? "Hidden" : "Active"}
              </span>
              <div className="product-admin-actions">
                <Button variant="secondary" onClick={() => openEdit(p)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => deleteProduct(p)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        {modal && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="card-head">
                <div>
                  <span className="eyebrow">
                    {editingId ? "Update listing" : "New listing"}
                  </span>
                  <div className="display-sm">
                    {editingId ? "Edit product" : "Add a product"}
                  </div>
                </div>
                <Button
                  variant="icon"
                  icon="close"
                  onClick={() => setModal(false)}
                />
              </div>
              <label className="upload-box upload-control">
                <Icon name="upload" />
                <b>
                  {draft.image !== products[0].image
                    ? "Product image selected"
                    : "Upload product image"}
                </b>
                <span>PNG or JPG · local prototype preview</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () =>
                        updateDraft("image", String(reader.result))
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
              <Field
                label="Product name"
                placeholder="e.g. Gulab Kundan Bangles"
                value={draft.name}
                onChange={(value) => updateDraft("name", value)}
              />
              <div className="form-two">
                <Select
                  label="Category"
                  value={draft.category}
                  onChange={(value) => updateDraft("category", value)}
                >
                  <option>Traditional Bangles</option>
                  <option>Handmade Earrings</option>
                  <option>Resin Art</option>
                  <option>Personalised Gifts</option>
                  <option>Handmade Jewellery</option>
                </Select>
                <Field
                  label="Price"
                  prefix="₹"
                  placeholder="0"
                  value={String(draft.price || "")}
                  onChange={(value) =>
                    updateDraft("price", Number(value.replace(/\D/g, "")))
                  }
                />
              </div>
              <div className="form-two">
                <Field
                  label="Original price · Optional"
                  prefix="₹"
                  placeholder="0"
                  value={String(draft.oldPrice || "")}
                  onChange={(value) =>
                    updateDraft(
                      "oldPrice",
                      Number(value.replace(/\D/g, "")) || undefined,
                    )
                  }
                />
                <Select
                  label="Homepage placement"
                  value={draft.placement || "New arrival"}
                  onChange={(value) =>
                    updateDraft("placement", value as Product["placement"])
                  }
                >
                  <option>Bestseller</option>
                  <option>New arrival</option>
                  <option>Both</option>
                </Select>
              </div>
              <Field
                label="Description"
                placeholder="Describe materials, craft and details"
                value={draft.description}
                onChange={(value) => updateDraft("description", value)}
              />
              <div className="form-two">
                <Field
                  label="Stock quantity"
                  placeholder="0"
                  value={String(draft.stock)}
                  onChange={(value) =>
                    updateDraft("stock", Number(value.replace(/\D/g, "")))
                  }
                />
                <Field
                  label="Badge · Optional"
                  placeholder="e.g. Bestseller"
                  value={draft.badge || ""}
                  onChange={(value) => updateDraft("badge", value)}
                />
              </div>
              <div className="form-two">
                <Select
                  label="Storefront visibility"
                  value={draft.active === false ? "Hidden" : "Active"}
                  onChange={(value) =>
                    updateDraft("active", value === "Active")
                  }
                >
                  <option>Active</option>
                  <option>Hidden</option>
                </Select>
                <Select
                  label="Personalisation"
                  value={draft.custom ? "Available" : "Not available"}
                  onChange={(value) =>
                    updateDraft("custom", value === "Available")
                  }
                >
                  <option>Not available</option>
                  <option>Available</option>
                </Select>
              </div>
              <div className="modal-actions">
                <Button variant="ghost" onClick={() => setModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={saveProduct}
                  disabled={!draft.name.trim() || draft.price <= 0}
                >
                  {editingId ? "Save changes" : "Create product"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  )
}

function AdminCustomers({ go }: { go: (r: Route) => void }) {
  const customers = [
    [
      "SJC-C0186",
      "Priya Sharma",
      "priya@gmail.com",
      "+91 98765 43210",
      "6",
      "Active",
    ],
    [
      "SJC-C0185",
      "Riya Mehta",
      "riya@gmail.com",
      "+91 98214 23675",
      "3",
      "Active",
    ],
    [
      "SJC-C0184",
      "Ananya Iyer",
      "ananya@gmail.com",
      "+91 99876 12408",
      "1",
      "New",
    ],
  ]
  return (
    <AdminShell route="admin-customers" go={go}>
      <div className="admin-content">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Prototype customer records</span>
            <div className="display-md">Customers</div>
            <p>Fictional sample data for interface preview only.</p>
          </div>
        </div>
        <div className="admin-filters">
          <div className="admin-search">
            <Icon name="search" />
            <input
              aria-label="Search customers"
              placeholder="Search name, email or mobile..."
            />
          </div>
        </div>
        <section className="admin-table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Full name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Orders</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c[0]}>
                    {c.slice(0, 5).map((v, i) => (
                      <td key={i}>{i === 0 ? <b>{v}</b> : v}</td>
                    ))}
                    <td>
                      <span className="status delivered">{c[5]}</span>
                    </td>
                    <td>
                      <Button variant="icon" icon="chevron" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

function AdminSettings({ go }: { go: (r: Route) => void }) {
  const [settings, setSettings] = useState({
    storeName: "SJ Creations",
    email: "hello@sjcreations.in",
    mobile: "98765 43210",
    location: "Pune, Maharashtra",
    paymentInstructions:
      "Payment details will be shared after order confirmation.",
    confirmationMessage:
      "Thank you! We will contact you shortly to confirm your order.",
  })
  const [saved, setSaved] = useState(false)
  const [qrName, setQrName] = useState("")
  const update = (key: keyof typeof settings, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  return (
    <AdminShell route="admin-settings" go={go}>
      <div className="admin-content settings">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Configuration</span>
            <div className="display-md">Store settings</div>
            <p>
              Manage public store information and manual payment instructions.
            </p>
          </div>
          <Button
            onClick={() => {
              setSaved(true)
              window.setTimeout(() => setSaved(false), 2500)
            }}
          >
            {saved ? "Changes saved" : "Save changes"}
          </Button>
        </div>
        <section className="settings-card">
          <div>
            <div className="display-sm">Store details</div>
            <p>Shown on customer-facing receipts and contact areas.</p>
          </div>
          <div className="settings-form">
            <Field
              label="Store name"
              value={settings.storeName}
              onChange={(value) => update("storeName", value)}
            />
            <Field
              label="Contact email"
              value={settings.email}
              onChange={(value) => update("email", value)}
            />
            <Field
              label="Contact mobile"
              prefix="+91"
              value={settings.mobile}
              onChange={(value) => update("mobile", value)}
            />
            <Field
              label="Store location"
              value={settings.location}
              onChange={(value) => update("location", value)}
            />
          </div>
        </section>
        <section className="settings-card">
          <div>
            <div className="display-sm">UPI & payment</div>
            <p>
              Only upload your official QR. No real credentials are shown in
              this prototype.
            </p>
          </div>
          <div className="settings-form">
            <label className="upload-box upload-control">
              <Icon name="upload" />
              <b>Official UPI QR image</b>
              <span>
                {qrName || "Choose an image · prototype preview only"}
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => {
                  setQrName(event.target.files?.[0]?.name || "")
                  setSaved(false)
                }}
              />
            </label>
            <Field
              label="Payment instructions"
              value={settings.paymentInstructions}
              onChange={(value) => update("paymentInstructions", value)}
            />
            <Field
              label="Order confirmation message"
              value={settings.confirmationMessage}
              onChange={(value) => update("confirmationMessage", value)}
            />
            {saved && (
              <div className="settings-saved">
                <Icon name="check" size={16} />
                Store settings saved for this prototype session.
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  )
}

export default function App() {
  const knownRoutes: Route[] = [
    "home",
    "shop",
    "product",
    "wishlist",
    "cart",
    "checkout",
    "success",
    "orders",
    "order",
    "login",
    "signup",
    "verify",
    "profile",
    "admin-login",
    "admin",
    "admin-orders",
    "admin-delivered",
    "admin-products",
    "admin-customers",
    "admin-settings",
  ]
  const initialHash = window.location.hash.replace("#", "") as Route
  const [route, setRoute] = useState<Route>(
    knownRoutes.includes(initialHash) ? initialHash : "home",
  )
  const [catalog, setCatalog] = useState<Product[]>(() => {
    try {
      const savedCatalog = window.localStorage.getItem("sj-creations-catalog")
      return savedCatalog ? JSON.parse(savedCatalog) : products
    } catch {
      return products
    }
  })
  const [selected, setSelected] = useState(products[0])
  const [wishlist, setWishlist] = useState<number[]>([2, 4])
  const [cart, setCart] = useState<Record<number, number>>({ 1: 1, 3: 1 })
  const [adminStatuses, setAdminStatuses] = useState<Record<string, string>>({})
  const [toast, setToast] = useState("")
  const admin = route.startsWith("admin")

  useEffect(() => {
    const handleHashChange = () => {
      const hashRoute = window.location.hash.replace("#", "") as Route
      if (knownRoutes.includes(hashRoute)) {
        setRoute(hashRoute)
        window.scrollTo({ top: 0 })
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    handleHashChange()
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "sj-creations-catalog",
        JSON.stringify(catalog),
      )
    } catch {
      // The prototype still works in memory if browser storage is unavailable.
    }
  }, [catalog])

  const go = (next: Route) => {
    setRoute(next)
    window.location.hash = next
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  const open = (p: Product) => {
    setSelected(p)
    go("product")
  }
  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2200)
  }
  const addCart = (id: number) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
    notify("Added to your bag")
  }
  const toggleWish = (id: number) => {
    setWishlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
    )
    notify(
      wishlist.includes(id)
        ? "Removed from wishlist"
        : "Saved to your wishlist",
    )
  }
  const props = { go, open, addCart, wishlist, toggleWish }
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  let content: React.ReactNode
  switch (route) {
    case "home":
      content = <Home {...props} />
      break
    case "shop":
      content = <Shop {...props} />
      break
    case "product":
      content = <ProductDetail {...props} product={selected} />
      break
    case "wishlist":
      content = <Wishlist {...props} ids={wishlist} />
      break
    case "cart":
      content = <Cart cart={cart} setCart={setCart} go={go} open={open} />
      break
    case "checkout":
      content = <Checkout cart={cart} go={go} />
      break
    case "success":
      content = <OrderSuccess go={go} />
      break
    case "orders":
      content = <Orders go={go} />
      break
    case "order":
      content = <OrderDetail go={go} />
      break
    case "login":
      content = <Auth mode="login" go={go} />
      break
    case "signup":
      content = <Auth mode="signup" go={go} />
      break
    case "verify":
      content = <Verify go={go} />
      break
    case "profile":
      content = <Profile go={go} />
      break
    case "admin-login":
      content = <AdminLogin go={go} />
      break
    case "admin":
      content = <AdminDashboard go={go} />
      break
    case "admin-orders":
      content = (
        <AdminOrders
          go={go}
          status={adminStatuses}
          setStatus={setAdminStatuses}
        />
      )
      break
    case "admin-delivered":
      content = (
        <AdminOrders
          delivered
          go={go}
          status={adminStatuses}
          setStatus={setAdminStatuses}
        />
      )
      break
    case "admin-products":
      content = <AdminProducts go={go} />
      break
    case "admin-customers":
      content = <AdminCustomers go={go} />
      break
    case "admin-settings":
      content = <AdminSettings go={go} />
      break
  }

  const standalone =
    ["login", "signup", "verify", "profile"].includes(route) || admin
  return (
    <CatalogContext.Provider value={{ catalog, setCatalog }}>
      <div>
        {!standalone && (
          <Header
            route={route}
            go={go}
            cartCount={cartCount}
            wishCount={wishlist.length}
          />
        )}
        {content}
        {!standalone && route !== "success" && <Footer go={go} />}
        {toast && (
          <div className="toast">
            <Icon name="check" />
            {toast}
          </div>
        )}
      </div>
    </CatalogContext.Provider>
  )
}
