import { useState } from "react"
import { ArrowLeft, ShieldCheck, ShoppingCart, Store } from "lucide-react"
import { Button, Checkbox, InputField, SelectField } from "@figma/astraui"
import { useStore, type Role } from "../../lib/store"
import { LogoMark } from "../../components/Logo"

const ROLE_CREDS: Record<Role, { email: string; password: string; label: string; icon: typeof ShoppingCart; blurb: string }> = {
  customer: {
    email: "ananya.sharma@gmail.com",
    password: "demo1234",
    label: "Customer",
    icon: ShoppingCart,
    blurb: "Shop from trusted sellers across India.",
  },
  vendor: {
    email: "seller@nexaelectronics.in",
    password: "seller123",
    label: "Vendor",
    icon: Store,
    blurb: "Manage your products, inventory and orders.",
  },
  admin: {
    email: "admin@markethub.in",
    password: "admin123",
    label: "Admin",
    icon: ShieldCheck,
    blurb: "Manage vendors, customers and the whole marketplace.",
  },
}

export function Login() {
  const { login, go, toast } = useStore()
  const [role, setRole] = useState<Role>("customer")
  const [email, setEmail] = useState(ROLE_CREDS.customer.email)
  const [password, setPassword] = useState(ROLE_CREDS.customer.password)

  function pickRole(r: Role) {
    setRole(r)
    setEmail(ROLE_CREDS[r].email)
    setPassword(ROLE_CREDS[r].password)
  }

  function submit() {
    if (!email.trim() || !password.trim()) {
      toast("Enter your email and password", "error")
      return
    }
    login(role)
    toast(`Signed in as ${ROLE_CREDS[role].label}`, "success")
  }

  return (
    <AuthShell title="Welcome back" subtitle={ROLE_CREDS[role].blurb}>
      <div className="flex flex-col gap-lg">
        {/* Sign-in role — customers, sellers and the marketplace admin use one door. */}
        <div>
          <span className="text-label-sm font-medium text-text-secondary">Sign in as</span>
          <div className="mt-md grid grid-cols-3 gap-md">
            {(Object.keys(ROLE_CREDS) as Role[]).map((r) => {
              const Icon = ROLE_CREDS[r].icon
              const active = role === r
              return (
                <button
                  key={r}
                  onClick={() => pickRole(r)}
                  aria-pressed={active}
                  className={`mh-lift flex flex-col items-center gap-xs rounded-corner-lg border p-md text-center transition-colors ${
                    active
                      ? "border-border-selected bg-brand-tertiary text-brand-primary"
                      : "border-border-secondary text-text-secondary hover:bg-bg-hover"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-video-title font-medium">{ROLE_CREDS[r].label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <InputField label="Email address" value={email} onChange={setEmail} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked onChange={() => {}} />
          <button className="text-label-sm text-brand-primary">Forgot password?</button>
        </div>
        <Button variant="primary" className="w-full" onClick={submit}>
          Sign in as {ROLE_CREDS[role].label}
        </Button>
        <p className="text-center text-label-sm text-text-secondary">
          New to MarketHub?{" "}
          <button onClick={() => go("register")} className="text-brand-primary font-medium">
            Create an account
          </button>
        </p>
      </div>
    </AuthShell>
  )
}

export function Register() {
  const { login, go, toast } = useStore()
  const [type, setType] = useState("customer")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)

  function submit() {
    if (!name.trim() || !email.trim() || !phone.trim() || password.length < 6) {
      toast("Fill all fields (password 6+ characters)", "error")
      return
    }
    if (!agree) {
      toast("Please accept the terms to continue", "warning")
      return
    }
    if (type === "vendor") {
      login("vendor")
      toast("Seller application submitted — welcome to your Seller Center", "success")
    } else {
      login("customer")
      toast("Account created — welcome to MarketHub", "success")
    }
  }

  return (
    <AuthShell
      title={type === "vendor" ? "Become a seller" : "Create your account"}
      subtitle={
        type === "vendor"
          ? "Start selling to customers across India. Applications are reviewed by our team."
          : "Join MarketHub to shop from trusted local sellers."
      }
    >
      <div className="flex flex-col gap-lg">
        <SelectField
          label="I want to"
          options={[
            { value: "customer", label: "Shop as a customer" },
            { value: "vendor", label: "Sell as a vendor" },
          ]}
          value={type}
          onChange={setType}
        />
        <InputField label={type === "vendor" ? "Business name" : "Full name"} value={name} onChange={setName} />
        <div className="flex flex-col gap-lg sm:flex-row">
          <div className="flex-1">
            <InputField label="Email" value={email} onChange={setEmail} />
          </div>
          <div className="flex-1">
            <InputField label="Phone" value={phone} onChange={setPhone} />
          </div>
        </div>
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          defaultChecked={false}
          onChange={setAgree}
        />
        <Button variant="primary" className="w-full" onClick={submit}>
          {type === "vendor" ? "Apply to sell" : "Create account"}
        </Button>
        <p className="text-center text-label-sm text-text-secondary">
          Already have an account?{" "}
          <button onClick={() => go("login")} className="text-brand-primary font-medium">
            Sign in
          </button>
        </p>
      </div>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const { back } = useStore()
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-xl py-2xl">
      <div className="mb-lg">
        <Button variant="subtle" size="small" iconStart={<ArrowLeft size={16} />} onClick={() => back("landing")}>
          Back
        </Button>
      </div>
      <div className="mh-glass mh-spatial mh-rise w-full rounded-corner-lg p-2xl">
        <div className="mb-xl flex items-center gap-md">
          <LogoMark size={40} />
          <span className="text-heading font-semibold text-text-primary">
            Market<span className="text-brand-primary">Hub</span>
          </span>
        </div>
        <h1 className="text-title text-text-primary">{title}</h1>
        <p className="text-label-sm text-text-secondary mt-xs mb-xl">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}
