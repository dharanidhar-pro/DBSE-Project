import { useState } from "react"
import { ArrowLeft, LogIn, ShieldCheck, Store } from "lucide-react"
import { Button, Checkbox, InputField } from "@figma/astraui"
import { useStore } from "../../lib/store"
import { LogoMark } from "../../components/Logo"

export function Login() {
  const { authenticate, go, toast } = useStore()
  return <LoginForm role="customer" title="Customer Login" subtitle="Shop from trusted sellers across India." authenticate={authenticate} go={go} toast={toast} />
}

export function VendorLogin() {
  const { authenticate, go, toast } = useStore()
  return <LoginForm role="vendor" title="Vendor Login" subtitle="Manage your products, inventory and orders." authenticate={authenticate} go={go} toast={toast} />
}

export function VendorRegister() {
  const { registerVendor, go, toast } = useStore()
  const [businessName, setBusinessName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  function submit() {
    if (!businessName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      toast("Fill all vendor application fields", "error")
      return
    }
    registerVendor({ business_name: businessName, email, phone, address })
    toast("Vendor application submitted for admin approval", "success")
    go("vendor-login")
  }

  return (
    <AuthShell title="Become a vendor" subtitle="Apply to sell products on MarketHub. Every application is reviewed by an admin." onBack={() => go("vendor-login")}>
      <div className="flex flex-col gap-lg">
        <InputField label="Business name" value={businessName} onChange={setBusinessName} />
        <InputField label="Business email" value={email} onChange={setEmail} />
        <InputField label="Phone" value={phone} onChange={setPhone} />
        <InputField label="Business address" value={address} onChange={setAddress} />
        <Button variant="primary" className="w-full" onClick={submit}>Submit vendor application</Button>
        <p className="text-center text-label-sm text-text-secondary">Already a vendor? <button onClick={() => go("vendor-login")} className="font-medium text-brand-primary">Vendor login</button></p>
      </div>
    </AuthShell>
  )
}

export function AdminLogin() {
  const { authenticate, go, toast } = useStore()
  return <LoginForm role="admin" title="Admin Login" subtitle="Secure access for marketplace administrators." authenticate={authenticate} go={go} toast={toast} />
}

function LoginForm({ role, title, subtitle, authenticate, go, toast }: { role: "customer" | "vendor" | "admin"; title: string; subtitle: string; authenticate: ReturnType<typeof useStore>["authenticate"]; go: ReturnType<typeof useStore>["go"]; toast: ReturnType<typeof useStore>["toast"] }) {
  const [email, setEmail] = useState(role === "customer" ? "ananya.sharma@gmail.com" : role === "vendor" ? "sales@nexaelectronics.in" : "admin@markethub.in")
  const [password, setPassword] = useState(role === "customer" ? "demo1234" : role === "vendor" ? "seller123" : "admin123")
  const Icon = role === "vendor" ? Store : role === "admin" ? ShieldCheck : LogIn

  function submit() {
    if (!email.trim() || !password.trim()) {
      toast("Enter your email and password", "error")
      return
    }
    const result = authenticate(role, email, password)
    if (result === "invalid") toast("Account details were not recognized", "error")
    else if (role === "vendor" && result === "pending") toast("Your vendor account is awaiting admin approval", "warning")
    else if (role === "vendor" && result === "rejected") toast("Your vendor account was rejected", "error")
    else toast(`Signed in as ${role === "customer" ? "Customer" : role === "vendor" ? "Vendor" : "Admin"}`, "success")
  }

  return (
    <AuthShell title={title} subtitle={subtitle} onBack={() => go("landing")}>
      <div className="flex flex-col gap-lg">
        <div className="flex items-center gap-md rounded-corner-md bg-brand-tertiary p-md text-label-sm text-text-secondary">
          <Icon size={18} className="text-brand-primary" />
          <span>{role === "customer" ? "Your MarketHub shopping account" : role === "vendor" ? "Seller Center access" : "Restricted marketplace administration"}</span>
        </div>
        <InputField label={role === "admin" ? "Admin email" : role === "vendor" ? "Vendor email" : "Email address"} value={email} onChange={setEmail} />
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" defaultChecked onChange={() => {}} />
          <button className="text-label-sm text-brand-primary">Forgot password?</button>
        </div>
        <Button variant="primary" className="w-full" onClick={submit}>
          {role === "customer" ? "Login" : role === "vendor" ? "Vendor Login" : "Admin Login"}
        </Button>
        {role === "customer" && (
          <p className="text-center text-label-sm text-text-secondary">
            New to MarketHub? <button onClick={() => go("register")} className="font-medium text-brand-primary">Create a customer account</button>
          </p>
        )}
        {role === "vendor" && (
          <p className="text-center text-label-sm text-text-secondary">
            New seller? <button onClick={() => go("vendor-register")} className="font-medium text-brand-primary">Apply to sell</button>
          </p>
        )}
      </div>
    </AuthShell>
  )
}

export function Register() {
  const { authenticate, go, toast } = useStore()
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
    authenticate("customer", email, password)
    toast("Account created — welcome to MarketHub", "success")
  }

  return (
    <AuthShell title="Create your account" subtitle="Join MarketHub to shop from trusted local sellers." onBack={() => go("landing")}>
      <div className="flex flex-col gap-lg">
        <InputField label="Full name" value={name} onChange={setName} />
        <div className="flex flex-col gap-lg sm:flex-row">
          <div className="flex-1"><InputField label="Email" value={email} onChange={setEmail} /></div>
          <div className="flex-1"><InputField label="Phone" value={phone} onChange={setPhone} /></div>
        </div>
        <InputField label="Password" type="password" value={password} onChange={setPassword} />
        <Checkbox label="I agree to the Terms of Service and Privacy Policy" defaultChecked={false} onChange={setAgree} />
        <Button variant="primary" className="w-full" onClick={submit}>Create customer account</Button>
        <p className="text-center text-label-sm text-text-secondary">Already have an account? <button onClick={() => go("login")} className="font-medium text-brand-primary">Sign in</button></p>
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
