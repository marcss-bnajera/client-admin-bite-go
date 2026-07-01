import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const SearchableSelect = ({
    value,
    onChange,
    options = [],
    placeholder = "Seleccionar...",
    icon: Icon,
    searchPlaceholder = "Buscar...",
    emptyText = "Sin resultados",
    subtitle,
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const selected = options.find((o) => o.value === value);

    const filtered = useMemo(() => {
        if (!query.trim()) return options;
        const q = normalize(query);
        return options.filter(
            (o) =>
                normalize(o.label).includes(q) ||
                (o.subtitle && normalize(o.subtitle).includes(q))
        );
    }, [options, query]);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (val) => {
        onChange(val === value ? "" : val);
        setOpen(false);
        setQuery("");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onChange("");
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setOpen(false);
            setQuery("");
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 bg-white border border-[#E8D8C3] rounded-xl px-3 h-10 w-full focus-within:border-[#E67E22] transition-colors text-left"
            >
                {Icon && <Icon size={14} className="text-[#6B6B6B] shrink-0" />}
                <span className={`flex-1 truncate text-sm ${selected ? "text-[#2B2B2B]" : "text-[#6B6B6B]"}`} title={selected?.label}>
                    {selected ? selected.label : placeholder}
                </span>
                {selected && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-[#6B6B6B] hover:text-[#C0392B] transition-colors shrink-0 p-0.5"
                    >
                        <X size={12} />
                    </button>
                )}
                <ChevronDown
                    size={14}
                    className={`text-[#6B6B6B] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[#E8D8C3] rounded-xl shadow-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 h-9 border-b border-[#E8D8C3]">
                        <Search size={13} className="text-[#6B6B6B] shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="outline-none text-sm w-full bg-transparent text-[#2B2B2B] placeholder:text-[#6B6B6B]"
                            placeholder={searchPlaceholder}
                        />
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-4 text-xs text-[#6B6B6B] text-center">{emptyText}</p>
                        ) : (
                            filtered.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full flex flex-col gap-0.5 px-3 py-2.5 text-left text-sm transition-colors ${
                                        opt.value === value
                                            ? "bg-[#FDF6EE] border-l-2 border-[#E67E22] text-[#E67E22] font-bold"
                                            : "hover:bg-[#F5EFE6] text-[#2B2B2B] border-l-2 border-transparent"
                                    }`}
                                >
                                    <span className="truncate" title={opt.label}>{opt.label}</span>
                                    {opt.subtitle && (
                                        <span className="text-[11px] text-[#6B6B6B] truncate">{opt.subtitle}</span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
