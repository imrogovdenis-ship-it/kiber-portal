import { handleLeadRequest } from '../../server/lead-routing/api-leads';

export async function POST({ request }: { request: Request }) {
  return handleLeadRequest(request, process.env);
}
