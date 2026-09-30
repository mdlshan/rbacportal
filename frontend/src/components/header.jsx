function Header({ onLogout }) {
    return (
        <header>

            <div>
                <button onClick={onLogout}>Log out</button>
            </div>
        </header>
    )
}

export default Header
