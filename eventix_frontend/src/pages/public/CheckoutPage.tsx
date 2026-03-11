import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function CheckoutPage() {
  const { reservationId } = useParams();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <CardTitle>Complete Your Reservation</CardTitle>
          <p className="text-muted-foreground">Reservation ID: {reservationId}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Attendee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" />
              <Input label="Last Name" placeholder="Doe" />
            </div>
            <Input label="Email" type="email" placeholder="john@example.com" />
          </div>

          <div className="pt-6 border-t space-y-4">
            <h3 className="font-semibold text-lg">Payment Details</h3>
            <div className="p-4 bg-muted rounded-md text-sm text-center">
              Stripe Elements integration will go here
            </div>
          </div>

          <Button className="w-full mt-6" size="lg">Pay Now</Button>
          <div className="text-center mt-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Cancel and return to event list
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
