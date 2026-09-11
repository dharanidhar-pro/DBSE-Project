import { useRef, type ChangeEvent } from "react"
import { Camera } from "lucide-react"
import { useStore, type Role } from "../lib/store"

/* Editable profile photo. The kit Avatar renders initials at fixed sizes and
   has no upload affordance, so we render the photo/initials directly and layer
   a camera button that reads a local file into a data URL (stored in the app
   state via setAvatar). Colors come from kit tokens. */
export function AvatarUpload({
  role,
  initials,
  size = 88,
}: {
  role: Role
  initials: string
  size?: number
}) {
  const { avatars, setAvatar, toast } = useStore()
  const ref = useRef<HTMLInputElement>(null)
  const url = avatars[role]

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast("Please choose an image file", "error")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setAvatar(role, String(reader.result))
      toast("Profile photo updated", "success")
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  return (
    <div className="relative inline-flex shrink-0">
      {url ? (
        <img
          src={url}
          alt="Profile"
          className="rounded-corner-full border border-border-secondary object-cover mh-skeuo"
          style={{ width: size, height: size }}
        />
      ) : (
        <span
          className="flex items-center justify-center rounded-corner-full bg-brand-primary text-on-brand mh-skeuo text-heading font-semibold"
          style={{ width: size, height: size }}
        >
          {initials.slice(0, 2).toUpperCase()}
        </span>
      )}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        aria-label="Change profile photo"
        className="mh-lift absolute -bottom-0.5 -right-0.5 flex size-8 items-center justify-center rounded-corner-full border-2 border-surface-bg bg-brand-primary text-on-brand"
      >
        <Camera size={15} />
      </button>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
    </div>
  )
}
