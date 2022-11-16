import Logo from "$assets/img/logo.png"

export default function Welcome() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <img
        className="h-52 w-52 drop-shadow-sm"
        src={Logo}
        alt="Ordo Logo"
      />
    </div>
  )
}
