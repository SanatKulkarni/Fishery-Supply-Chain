import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <main className="main-content">
        <h1 className="title">Fishery Supply Chain</h1>
        
        <div className="nav-links">
          <Link href="/participant" className="nav-button">
            Register as Participant
          </Link>
          <Link href="/addFish" className="nav-button">
            Add New Fish
          </Link>
          <Link href="/ownerRoleChange" className="nav-button">
            Change Participant Role (Not Implemented in Contract)
          </Link>
        </div>
      </main>
    </div>
  );
}
