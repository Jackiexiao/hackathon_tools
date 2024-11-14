import Link from 'next/link';
import { Trophy, Vote } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const tools = [
    {
      title: 'Lucky Wheel',
      description: 'Exciting prize wheel for hackathon rewards',
      icon: Trophy,
      href: '/lucky-wheel',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Live Voting',
      description: 'Real-time voting system with QR code support',
      icon: Vote,
      href: '/voting',
      gradient: 'from-blue-500 to-purple-500',
    },
  ];

  return (
    <div className="container py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Weekly Hackathon Tools
        </h1>
        <p className="text-muted-foreground text-lg">
          Essential tools to make your hackathon events more exciting and engaging
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="group hover:shadow-lg transition-all duration-200 p-6">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary">
                {tool.title}
              </h2>
              <p className="text-muted-foreground">
                {tool.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}