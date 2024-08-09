import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpCircle, ExternalLink } from 'lucide-react';

const fetchTopStories = async () => {
  const response = await axios.get('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  return response.data.hits;
};

const StoryCard = ({ story }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{story.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center text-sm text-gray-500">
        <ArrowUpCircle className="w-4 h-4 mr-1" />
        <span>{story.points} points</span>
      </div>
    </CardContent>
    <CardFooter>
      <a
        href={story.url || `https://news.ycombinator.com/item?id=${story.objectID}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-blue-500 hover:underline"
      >
        Read More <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    </CardFooter>
  </Card>
);

const SkeletonCard = () => (
  <Card className="mb-4">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-1/4" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-4 w-1/3" />
    </CardFooter>
  </Card>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['topStories'],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Top 100 Hacker News Stories</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
      </div>
      {isLoading && (
        <div>
          {[...Array(5)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}
      {error && <p className="text-red-500">Error loading stories. Please try again later.</p>}
      {filteredStories && (
        <div>
          {filteredStories.map(story => (
            <StoryCard key={story.objectID} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
