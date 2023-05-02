import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";

// Pieprasījums uz serveri
// piehglabajam datus iekš state
// renderējam datus no state

type Article = {
  title: string;
  id: string;
  description: string;
};

type ArticleFormProps = {
  article: Article;
  onSubmit: (title: string, description: string) => void;
};

const delay = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

const API_URL = "http://localhost:3004/articles";

export const TodoListFromServer = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        setIsLoading(true);
        await delay(1000);
        const data = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const articles = await data.json();
        setArticles(articles);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("error", error);
      }
    };

    fetchData2();
  }, []);

      // Izdzēst article
      // Izveidot formu, no kuras var paņemt datus, lai pievienotu jauno article.
      // Edit opciju.
      // Axios  npm i axios
      // Nostilojam
      // Pievienojam loading

  const addArticle = async () => {
    const newArticle = {
      title: `New article ${count}`,
      description: `New article description ${count}`,
    };
    try {
      setIsLoading(true);
      await delay(1000);
  
      const { data } = await axios.post(API_URL, newArticle);
      console.log("data", data);

      setArticles([...articles, data]);
      setIsLoading(false);
      setCount(count + 1);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      setIsLoading(true);
      await delay(1000);

      await axios.delete(`${API_URL}/${id}`);

      const filteredArticles = articles.filter((article) => article.id !== id);
      setArticles(filteredArticles);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  const editArticleForm = (article: Article) => {
    setEditingArticleId(article.id);
  };

  const updateArticle = async (id: string, updatedArticle: Article) => {
    try {
      setIsLoading(true);
      await delay(1000);
      const { data } = await axios.put(`${API_URL}/${id}`, updatedArticle);
      setArticles(
        articles.map((article) => (article.id === id ? data : article))
      );
      setIsLoading(false);
      setEditingArticleId(null);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };
  
  const ArticleForm = ({ article, onSubmit }: ArticleFormProps) => {
    const [title, setTitle] = useState(article.title);
    const [description, setDescription] = useState(article.description);
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit(title, description);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>
        <button type="submit">Save</button>
      </form>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onButtonClick={addArticle}>Add new Article</Button>
      {articles.length > 0 ? (
        articles.map((article) => {
          if (editingArticleId === article.id) {
            return (
              <div key={article.id}>
                <ArticleForm
                  article={article}
                  onSubmit={(title, description) =>
                    updateArticle(article.id, { ...article, title, description })
                  }
                />
              </div>
            );
          } else {
            return (
              <div key={article.id}>
                <h3>{article.title}</h3>
                <p>{/*article.description}*/}</p>
                <Button onButtonClick={() => editArticleForm(article)}>
                  Edit
                </Button>
                <Button onButtonClick={() => deleteArticle(article.id)}>
                  Delete
                </Button>
              </div>
            );
          }
        })
      ) : (
        <div>No articles found.</div>
      )}
    </div>
  );
};


