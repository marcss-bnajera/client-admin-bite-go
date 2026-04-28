export const Pagination = ({ currentPage, totalPages, total, itemsShown, onPageChange }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#6B6B6B]">
            <span>
                Mostrando <strong className="text-[#2B2B2B]">{itemsShown}</strong> de{" "}
                <strong className="text-[#2B2B2B]">{total}</strong> registros
            </span>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg border border-[#E8D8C3] hover:border-[#E67E22] hover:text-[#E67E22] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((item, idx) =>
                        item === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 text-[#6B6B6B]">...</span>
                        ) : (
                            <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                className={`px-3 py-1 rounded-lg font-bold transition-colors ${item === currentPage
                                    ? "bg-[#E67E22] text-white"
                                    : "border border-[#E8D8C3] hover:border-[#E67E22] hover:text-[#E67E22]"
                                    }`}
                            >
                                {item}
                            </button>
                        )
                    )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg border border-[#E8D8C3] hover:border-[#E67E22] hover:text-[#E67E22] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};