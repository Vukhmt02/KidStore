import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const phone = form.get("phone");
    const address = form.get("address");
    const password = form.get("password");
    const nextErrors = {};

    if (!name) nextErrors.name = "Vui long nhap ho ten";
    if (!email || !email.includes("@")) nextErrors.email = "Email chua hop le";
    if (!phone || phone.trim().length < 9) nextErrors.phone = "So dien thoai chua hop le";
    if (!address) nextErrors.address = "Vui long nhap dia chi";
    if (!password || password.length < 6) nextErrors.password = "Mat khau toi thieu 6 ky tu";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      await authService.register({
        name,
        fullName: name,
        email,
        phone,
        address,
        password
      });

      navigate("/login", {
        state: {
          message: "Dang ky thanh cong. Hay dang nhap de tiep tuc."
        }
      });
    } catch (error) {
      const message =
        error.status === 400 || error.status === 409
          ? error.message || "Email da ton tai hoac thong tin chua hop le"
          : "Khong the dang ky luc nay. Vui long thu lai sau.";

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
        <h1 className="text-3xl font-black text-cocoa">Tao tai khoan</h1>
        <p className="mt-2 text-sm text-cocoa/70">Dang ky de luu thong tin mua hang nhanh hon.</p>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <Input label="Ho ten" name="name" placeholder="Nguyen Minh An" error={errors.name} />
          <Input label="Email" name="email" type="email" placeholder="you@example.com" error={errors.email} />
          <Input label="So dien thoai" name="phone" type="tel" placeholder="0909 123 456" error={errors.phone} />
          <Input label="Dia chi" name="address" placeholder="24 Pastel Street, TP.HCM" error={errors.address} />
          <Input label="Mat khau" name="password" type="password" placeholder="********" error={errors.password} />
          
          {errors.form && <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm font-semibold text-berry">{errors.form}</p>}

          <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
            {loading ? "Dang tao tai khoan..." : "Dang ky"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-cocoa/70">
          Da co tai khoan?{" "}
          <Link to="/login" className="font-bold text-berry hover:text-cocoa">
            Dang nhap
          </Link>
        </p>
      </div>
    </section>
  );
}
