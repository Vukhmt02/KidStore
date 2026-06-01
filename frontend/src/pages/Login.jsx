import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    const nextErrors = {};

    if (!email || !email.includes("@")) nextErrors.email = "Email chua hop le";
    if (!password || password.length < 6) nextErrors.password = "Mat khau toi thieu 6 ky tu";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const result = await authService.login({ email, password });
      const token = result.accessToken || result.token;

      if (token) {
        localStorage.setItem("accessToken", token);
      }

      if (result.user) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
      }

      navigate("/");
    } catch (error) {
      const message =
        error.status === 401 || error.status === 400
          ? "Email hoac mat khau khong dung"
          : "Khong the dang nhap luc nay. Vui long thu lai sau.";

      setErrors({
        form: message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-page grid min-h-[calc(100vh-20rem)] place-items-center py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-cocoa/10 bg-white p-6 shadow-soft sm:p-8">
        <h1 className="text-3xl font-black text-cocoa">Dang nhap</h1>
        <p className="mt-2 text-sm text-cocoa/70">Tiep tuc mua sam va theo doi gio hang KidStore.</p>

        {location.state?.message && (
          <p className="mt-5 rounded-2xl bg-mint/70 px-4 py-3 text-sm font-semibold text-cocoa">{location.state.message}</p>
        )}

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <Input label="Email" name="email" type="email" placeholder="you@example.com" error={errors.email} />
          <Input label="Mat khau" name="password" type="password" placeholder="********" error={errors.password} />

          {errors.form && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{errors.form}</p>}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
            {loading ? "Dang dang nhap..." : "Dang nhap"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cocoa/70">
          Chua co tai khoan?{" "}
          <Link to="/register" className="font-bold text-berry hover:text-cocoa">
            Dang ky
          </Link>
        </p>
      </div>
    </section>
  );
}
