// database_funcs.js
import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  getDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Function to add a new thread
export async function addThread(threadName, zipCode, city) {
  try {
    const threadRef = await addDoc(collection(db, "Threads"), {
      thread_name: threadName,
      city: city,
      zip_code: zipCode
    });
    console.log("Thread added successfully with ID:", threadRef.id);
  } catch (error) {
    console.error("Error adding thread:", error);
  }
}

// Function to add comment to thread
export async function addCommentToThread(threadId, commentText) {
  try {
    const commentsRef = await addDoc(collection(db, "Threads", threadId, "Comments"), {
      text: commentText,
      upvotes: 0
    });
    console.log("Comment added successfully with ID:", commentsRef.id);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

// Increment comment upvote count function
export async function incrementUpvote(threadId, commentId) {
  try {
    const commentRef = doc(db, "Threads", threadId, "Comments", commentId);
    await updateDoc(commentRef, {
      upvotes: increment(1)
    });
    console.log("Upvote incremented successfully for comment ID:", commentId);
  } catch (error) {
    console.error("Error incrementing upvote:", error);
  }
}

// Decrement comment upvote count function
export async function decrementUpvote(threadId, commentId) {
  try {
    const commentRef = doc(db, "Threads", threadId, "Comments", commentId);
    await updateDoc(commentRef, {
      upvotes: increment(-1)
    });
    console.log("Upvote decremented successfully for comment ID:", commentId);
  } catch (error) {
    console.error("Error decrementing upvote:", error);
  }
}

// Function to get all threads
export async function getAllThreads() {
  try {
    const threadsRef = collection(db, 'Threads');
    const snapshot = await getDocs(threadsRef);

    const threads = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      threads.push({
        id: doc.id,
        thread_name: data.thread_name,
        city: data.city,
        zip_code: data.zip_code
      });
    });

    return threads;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw new Error('Failed to retrieve threads');
  }
}

// Delete thread function
export async function deleteThread(threadId) {
  try {
    const threadRef = doc(db, "Threads", threadId);
    await deleteDoc(threadRef);
    console.log("Thread deleted successfully with ID:", threadId);
  } catch (error) {
    console.error("Error deleting thread:", error);
  }
}

// Delete comment function
export async function deleteCommentFromThread(threadId, commentId) {
  try {
    const commentRef = doc(db, "Threads", threadId, "Comments", commentId);
    await deleteDoc(commentRef);
    console.log("Comment deleted successfully with ID:", commentId);
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

// Function to get comments with upvotes
export async function getCommentsWithUpvotes(threadId) {
  try {
    const threadDocRef = doc(db, "Threads", threadId);
    const threadDoc = await getDoc(threadDocRef);

    if (!threadDoc.exists()) {
      throw new Error("Thread does not exist");
    }

    const threadName = threadDoc.data().thread_name;
    const threadZip = threadDoc.data().zip_code;
    const threadCity = threadDoc.data().city;

    const commentsRef = collection(db, "Threads", threadId, "Comments");
    const snapshot = await getDocs(commentsRef);

    const comments = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      comments.push({
        id: doc.id,
        text: data.text,
        upvotes: data.upvotes || 0
      });
    });

    return {
      thread_name: threadName,
      thread_zip: threadZip,
      thread_city: threadCity,
      comments: comments
    };
  } catch (error) {
    console.error("Error fetching comments with upvotes:", error);
    throw new Error("Failed to retrieve comments and thread name");
  }
}

// Function to get thread name by thread ID
export async function getThreadNameById(threadId) {
  try {
    const threadDocRef = doc(db, "Threads", threadId);
    const threadDoc = await getDoc(threadDocRef);

    if (!threadDoc.exists()) {
      throw new Error("Thread does not exist");
    }

    // Retrieve the thread name from the document data
    const threadName = threadDoc.data().thread_name;
    return threadName;
  } catch (error) {
    console.error("Error fetching thread name:", error);
    throw new Error("Failed to retrieve thread name");
  }
}

