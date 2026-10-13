import { useEffect, useState, type FormEvent } from "react";
import { COMPANY, SECTORS } from "@/content/site";
import { enquiry, useEnquirySector } from "@/lib/enquiry";
import { Chapter } from "@/components/stage/StageContext";
import { MaskLine } from "./motion";

type Fields = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  sector: string;
  product: string;
  message: string;
};

const EMPTY: Fields = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  sector: "",
  product: "",
  message: "",
};

const FIELD =
  "mt-1 w-full border-0 border-b border-ink/70 bg-transparent px-0 py-3 text-base text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink aria-[invalid=true]:border-destructive";

function mailtoFor(fields: Fields) {
  const sector = SECTORS.find((s) => s.id === fields.sector)?.name ?? "Not specified";
  const lines = [
    `Name: ${fields.name}`,
    `Company: ${fields.company || "-"}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone || "-"}`,
    `Country: ${fields.country || "-"}`,
    `Application: ${sector}`,
    `Product interest: ${fields.product || "-"}`,
    "",
    fields.message,
  ];
  const subject = `Website enquiry: ${sector}${fields.company ? `, ${fields.company}` : ""}`;
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n"),
  )}`;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [sent, setSent] = useState(false);
  const preselected = useEnquirySector();

  useEffect(() => {
    if (preselected) setFields((current) => ({ ...current, sector: preselected }));
  }, [preselected]);

  const set = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    if (key === "sector") enquiry.set(event.target.value as typeof preselected);
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Enter a valid email address.";
    if (!fields.message.trim()) next.message = "Tell us what you are looking for.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = (["name", "email", "message"] as const).find((key) => next[key]);
      if (first) document.getElementById(`field-${first}`)?.focus();
      return;
    }
    setSent(true);
    window.location.href = mailtoFor(fields);
  };

  const error = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`err-${key}`} className="mt-1 text-sm text-destructive">
        {errors[key]}
      </p>
    ) : null;
  const a11y = (key: keyof Fields) => ({
    id: `field-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `err-${key}` : undefined,
  });

  return (
    <Chapter
      id="contact"
      labelledBy="contact-title"
      className="border-t border-rule bg-paper-2 py-20 lg:py-32"
    >
      <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <h2
            id="contact-title"
            className="display text-[clamp(2.4rem,5vw,5rem)] text-ink"
          >
            <MaskLine>Start a</MaskLine>
            <MaskLine delay={0.08}>conversation.</MaskLine>
          </h2>
          <p className="copy mt-8 text-ink-soft">
            Tell us the application, the product and the market. Prefer to talk it through? Use
            the voice assistant at the bottom right of this page.
          </p>
          <address className="mt-12 not-italic">
            <p className="display text-[1.5rem] leading-[1.15] text-ink">{COMPANY.legalName}</p>
            <p className="mt-1 text-ink-soft">{COMPANY.location}</p>
            <ul className="mt-6 space-y-1 text-lg">
              <li>
                <a href={`mailto:${COMPANY.email}`} className="link-line inline-block py-2 text-ink">
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a href={COMPANY.phoneHref} className="link-line inline-block py-2 text-ink">
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.webHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-line inline-block py-2 text-ink"
                >
                  {COMPANY.web}
                </a>
              </li>
            </ul>
          </address>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          aria-describedby="form-note"
          className="lg:col-span-7"
        >
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <div>
              <label htmlFor="field-name" className="text-sm font-medium text-ink">
                Name
              </label>
              <input {...a11y("name")} autoComplete="name" required value={fields.name} onChange={set("name")} className={FIELD} />
              {error("name")}
            </div>
            <div>
              <label htmlFor="field-company" className="text-sm font-medium text-ink">
                Company
              </label>
              <input {...a11y("company")} autoComplete="organization" value={fields.company} onChange={set("company")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input {...a11y("email")} type="email" autoComplete="email" required value={fields.email} onChange={set("email")} className={FIELD} />
              {error("email")}
            </div>
            <div>
              <label htmlFor="field-phone" className="text-sm font-medium text-ink">
                Phone
              </label>
              <input {...a11y("phone")} type="tel" autoComplete="tel" value={fields.phone} onChange={set("phone")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-country" className="text-sm font-medium text-ink">
                Country
              </label>
              <input {...a11y("country")} autoComplete="country-name" value={fields.country} onChange={set("country")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-sector" className="text-sm font-medium text-ink">
                Application
              </label>
              <select {...a11y("sector")} value={fields.sector} onChange={set("sector")} className={`${FIELD} appearance-none rounded-none`}>
                <option value="">Select an application</option>
                {SECTORS.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-product" className="text-sm font-medium text-ink">
                Product interest
              </label>
              <input {...a11y("product")} value={fields.product} onChange={set("product")} className={FIELD} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-message" className="text-sm font-medium text-ink">
                Message
              </label>
              <textarea {...a11y("message")} required rows={4} value={fields.message} onChange={set("message")} className={`${FIELD} resize-none`} />
              {error("message")}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="btn w-full sm:w-auto sm:min-w-64">
              Prepare my enquiry
            </button>
            <p id="form-note" role="status" aria-live="polite" className="max-w-[36ch] text-sm text-ink-soft">
              {sent
                ? `Your email app should open with the enquiry ready to send. If it does not, write to ${COMPANY.email}.`
                : "This opens an email to our team with your details filled in."}
            </p>
          </div>
        </form>
      </div>
    </Chapter>
  );
}
