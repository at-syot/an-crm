import { useAtom } from "jotai";
import { adminAccessTokenAtom } from "../../src/states";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Admin from "../../src/components/Admin";

export default function AdminPage() {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const [adminAccessToken] = useAtom(adminAccessTokenAtom);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaded(true), 200);
    return () => clearInterval(timeout);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (adminAccessToken.length == 0) {
      router.push("/admin/auth");
      return;
    }
  }, [loaded, adminAccessToken]);

  return loaded ? <Admin /> : null;
}
