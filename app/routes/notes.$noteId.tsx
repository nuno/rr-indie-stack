import {
  redirect,
  Form,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import invariant from "tiny-invariant";

import { deleteNote, getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import type { Route } from "./+types/notes.$noteId";

export async function loader({ params, request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ id: params.noteId, userId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return { note };
}

export async function action({ params, request }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ id: params.noteId, userId });

  return redirect("/notes");
}

export default function NoteDetailsPage({ loaderData }: Route.ComponentProps) {
  const { title, body } = loaderData.note;

  return (
    <div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="py-6">{body}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
