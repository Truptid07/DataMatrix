import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex justify-end mb-4">
      <select
        onChange={changeLanguage}
        value={i18n.language}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded"
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  );
}
