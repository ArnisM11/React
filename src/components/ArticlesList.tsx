import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import "../styles/components/articles-list.scss";
import {Link} from "react-router-dom";
import {delay} from "../constants/delays";
import {Article} from "../types/Article";
import {ArticleFormProps} from "../types/ArticleFormProps";
import {API_URL} from "../constants/URL";
import { getRandomWords } from "../helpers/getRandomWords";



export const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        setIsLoading(true);
        await delay(500);
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

  const addArticle = async () => {
    const newArticle = {
      title: getRandomWords(3),
      description: getRandomWords(15)
    };
    try {
      setIsLoading(true);
      await delay(500);
  
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
      await delay(500);

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
      await delay(500);
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
    <div className ="article-list">
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
              <h2>{article.title}</h2>
              <Button onButtonClick={() => editArticleForm(article)}>
                Edit
              </Button>
              <Button onButtonClick={() => deleteArticle(article.id)}>
                Delete
              </Button>
              <Link to= {`/articles/${article.id}`}>
                <Button>Go to article</Button>
              </Link>
              </div>
            );
          }
        })
      ) : null
      }
    </div>
  );
};


