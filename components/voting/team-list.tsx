import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Team {
  id: string;
  name: string;
  votes: number;
}

interface TeamListProps {
  teams: Team[];
  onRemoveTeam?: (id: string) => void;
  showVotes?: boolean;
}

export function TeamList({ teams, onRemoveTeam, showVotes = false }: TeamListProps) {
  const totalVotes = teams.reduce((sum, team) => sum + team.votes, 0);
  const sortedTeams = showVotes 
    ? [...teams].sort((a, b) => b.votes - a.votes)
    : teams;

  return (
    <div className="grid gap-4">
      {sortedTeams.map((team) => (
        <Card key={team.id} className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{team.name}</span>
            {onRemoveTeam && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveTeam(team.id)}
              >
                删除
              </Button>
            )}
          </div>
          
          {showVotes && (
            <>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{team.votes} 票</span>
                <span>
                  {totalVotes > 0
                    ? Math.round((team.votes / totalVotes) * 100)
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={totalVotes > 0 ? (team.votes / totalVotes) * 100 : 0}
                className="h-2"
              />
            </>
          )}
        </Card>
      ))}
    </div>
  );
}