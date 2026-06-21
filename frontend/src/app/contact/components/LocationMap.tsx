interface LocationMapProps {
    isDark: boolean;
}

const LocationMap = ({ isDark }: LocationMapProps) => {
    return (
        <div
            className={`rounded-xl border overflow-hidden transition-all duration-smooth ${isDark ? 'border-slate-700' : 'border-slate-200'
                }`}
        >
            <div className="aspect-video w-full">
                <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title="Vertex Academy Location - Thiruvanmiyur, Chennai"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=12.9866858,80.2626738&z=15&output=embed"
                    className="border-0"
                />
            </div>
            <div
                className={`p-6 ${isDark ? 'bg-slate-800' : 'bg-white'
                    }`}
            >
                <h3
                    className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-text-primary'
                        }`}
                >
                    Easy to Find, Easy to Reach
                </h3>
                <p
                    className={`text-sm ${isDark ? 'text-slate-300' : 'text-text-secondary'
                        }`}
                >
                    Located in the vibrant Thiruvanmiyur area, our campus is easily accessible by public transport with ample parking facilities. Find us opposite Poomalai Senthur Nillayam Apartments on Anna Street.
                </p>
            </div>
        </div>
    );
};

export default LocationMap;