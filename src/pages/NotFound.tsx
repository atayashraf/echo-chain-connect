
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary-light/20">
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">404</h1>
          <p className="text-xl text-foreground mb-6">This page doesn't exist in any chain we know of</p>
          <p className="text-muted-foreground mb-8">The blockchain has no record of the content you're looking for.</p>
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link to="/">Return to Feed</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
