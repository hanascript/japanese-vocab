import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <Card className='rounded-lg border-2 border-orange-400/80 p-8'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold text-orange-400/80'>Word Of The Day</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className='flex items-start gap-2'>
        <div className='flex flex-col'>
          <div className='text-3xl font-bold'>すみません</div>

          <div className='text-center text-sm italic opacity-50'>(Sumimasen)</div>
        </div>
        <div className='pt-0.5 text-3xl font-bold'>・</div>
        <div className='pt-1 text-lg'>(excuse me; I'm sorry; I beg your pardon)</div>
      </CardContent>
    </Card>
  );
}
