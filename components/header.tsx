import { Button } from "./ui/button";

function Header() {
  return (
    <header className="flex items-center border-b border-b-gray-200 p-5 shadow-sm">
      <div className="font-bold">Todo App</div>
      <div className="ml-auto">
        <Button>Sign in</Button>
      </div>
    </header>
  );
}

export default Header;
