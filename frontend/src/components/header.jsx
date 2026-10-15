function Header({ onOpenProfile }) {
    return (
        <header className="flex  justify-end px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-4">
                <button type="button" onClick={onOpenProfile} aria-label="Open profile" className="material-symbols-outlined cursor-pointer">account_circle</button>
            </div>
        </header>
    )
}

export default Header
