import { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/router";

type Link = {
  title: string;
  url: string;
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [title, setTitle] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();
  const [links, setLinks] = useState<Link[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        const userId = user.data.user?.id;
        setUserId(userId);
        setIsAuthenticated(true);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("title, url")
          .eq("user_id", userId);
        if (error) throw error;
        console.log("data", data);
        setLinks(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    if (userId) getLinks();
  }, [userId]);

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
        const { data, error } = await supabase
          .from("links")
          .insert({
            title: title,
            url: url,
            user_id: userId,
          })
          .select();
        if (error) throw error;
        console.log("data", data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      router.push("/login");
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {isAuthenticated && (
        <div>
          <h1 className="text-2xl font-bold text-center">Add new link</h1>
          <p className="">Welcome {userId}</p>
          <div className="w-full max-w-xs form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Acid Gambit"
              className="w-full max-w-xs input input-bordered"
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="label">
              <span className="label-text">URL</span>
            </label>
            <input
              type="text"
              name="url"
              id="url"
              placeholder="https://www.acidgambit.com"
              className="w-full max-w-xs input input-bordered"
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button onClick={addNewLink} className="mt-4 btn">
            Add new link
          </button>
          <button onClick={signOut} className="mx-4 mt-4 btn">
            Sign Out
          </button>
          <div className="mt-4">
            <p>Links:</p>
            <div>
              {links.map((link: Link, index: number) => (
                <div className="mt-2" key={index}>
                  <a className="underline" href={link.url}>
                    {link.title}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
