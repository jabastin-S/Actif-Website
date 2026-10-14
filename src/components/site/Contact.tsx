import { useEffect, useState, type FormEvent } from "react";
import { COMPANY, SECTORS } from "@/content/site";
import { enquiry, useEnquirySector } from "@/lib/enquiry";
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
  "mt-1 w-full border-0 border-b border-on-dark/70 bg-transparent px-0 py-3 text-base text-on-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-dark aria-[invalid=true]:border-olive-soft";

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
      <p id={`err-${key}`} className="mt-1 text-sm text-olive-soft">
        {errors[key]}
      </p>
    ) : null;
  const a11y = (key: keyof Fields) => ({
    id: `field-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `err-${key}` : undefined,
  });

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="on-dark bg-charcoal section-y text-on-dark"
    >
      <div className="shell">
        <h2 id="contact-title" className="display text-[clamp(3rem,8.4vw,6rem)]">
          <MaskLine>Start a</MaskLine>
          <MaskLine delay={0.08}>conversation.</MaskLine>
        </h2>

        <address className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule-dark pt-7 not-italic lg:mt-12 lg:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm text-on-dark-soft">Company</p>
            <p className="mt-1 text-[0.9375rem]">{COMPANY.name}</p>
            <p className="text-[0.9375rem] text-on-dark-soft">{COMPANY.location}</p>
          </div>
          <div>
            <p className="text-sm text-on-dark-soft">Email</p>
            <a href={`mailto:${COMPANY.email}`} className="link-line mt-1 inline-block py-1 text-[0.9375rem]">
              {COMPANY.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-on-dark-soft">Phone</p>
            <a href={COMPANY.phoneHref} className="link-line mt-1 inline-block py-1 text-[0.9375rem]">
              {COMPANY.phone}
            </a>
          </div>
          <div>
            <p className="text-sm text-on-dark-soft">Web</p>
            <a
              href={COMPANY.webHref}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line mt-1 inline-block py-1 text-[0.9375rem]"
            >
              {COMPANY.web}
            </a>
          </div>
        </address>

        <form noValidate onSubmit={onSubmit} aria-describedby="form-note" className="mt-12 max-w-[64rem] lg:mt-16">
          <p className="mb-8 max-w-[52ch] text-on-dark-soft">
            Tell us what you are making, how the fabric should feel and perform, and whether you
            need a sample development or a commercial programme. Technical details help, but you
            do not need them to start. Prefer to talk it through? Use the voice assistant at the
            bottom right of this page.
          </p>
          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2 sm:gap-y-7">
            <div>
              <label htmlFor="field-name" className="text-sm font-medium">Name</label>
              <input {...a11y("name")} autoComplete="name" required value={fields.name} onChange={set("name")} className={FIELD} />
              {error("name")}
            </div>
            <div>
              <label htmlFor="field-company" className="text-sm font-medium">Company</label>
              <input {...a11y("company")} autoComplete="organization" value={fields.company} onChange={set("company")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-email" className="text-sm font-medium">Email</label>
              <input {...a11y("email")} type="email" autoComplete="email" required value={fields.email} onChange={set("email")} className={FIELD} />
              {error("email")}
            </div>
            <div>
              <label htmlFor="field-phone" className="text-sm font-medium">Phone</label>
              <input {...a11y("phone")} type="tel" autoComplete="tel" value={fields.phone} onChange={set("phone")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-country" className="text-sm font-medium">Country</label>
              <input {...a11y("country")} autoComplete="country-name" value={fields.country} onChange={set("country")} className={FIELD} />
            </div>
            <div>
              <label htmlFor="field-sector" className="text-sm font-medium">Application</label>
              <select {...a11y("sector")} value={fields.sector} onChange={set("sector")} className={`${FIELD} appearance-none rounded-none`}>
                <option value="" className="text-ink">Select an application</option>
                {SECTORS.map((sector) => (
                  <option key={sector.id} value={sector.id} className="text-ink">
                    {sector.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-product" className="text-sm font-medium">Product interest</label>
              <input {...a11y("product")} value={fields.product} onChange={set("product")} className={FIELD} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="field-message" className="text-sm font-medium">Message</label>
              <textarea {...a11y("message")} required rows={4} value={fields.message} onChange={set("message")} className={`${FIELD} resize-none`} />
              {error("message")}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
            <button type="submit" className="btn btn-light w-full sm:w-auto sm:min-w-72">
              Prepare my enquiry
            </button>
            <p id="form-note" role="status" aria-live="polite" className="max-w-[40ch] text-sm text-on-dark-soft">
              {sent
                ? `Your email app should open with the enquiry ready to send. If it does not, write to ${COMPANY.email}.`
                : "This opens an email to our team with your details filled in."}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
