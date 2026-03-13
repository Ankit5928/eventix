import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <Card className="animate-fade-in-up">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your tickets have been confirmed.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="rounded-md bg-muted p-4 text-sm">
              <span className="text-muted-foreground">Order ID: </span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            A confirmation email will be sent to you shortly with your ticket details.
          </p>
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Browse More Events
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
