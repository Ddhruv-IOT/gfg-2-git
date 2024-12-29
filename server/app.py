from flask import Flask, request, jsonify
import os
import shutil
import datetime
import subprocess

app = Flask(__name__)

# Persistent folder for automation
gfg_folder = r"E:\gfg_automated"

# Ensure the persistent folder exists
os.makedirs(gfg_folder, exist_ok=True)

@app.route("/")
def automate():
    problem_name = request.args.get("x")
    if not problem_name:
        return jsonify({"error": "Missing 'x' parameter"}), 400

    # Get today's date in the specified format
    today_date = datetime.datetime.now().strftime("%d_%m_%y")
    
    # Define source filenames and folder paths
    download_folder = r"C:\Users\Asus\Downloads"
    solution_file = f"sol_{today_date}.py"
    readme_file = f"readme_{today_date}.md"

    # Define target folder and filenames
    target_folder = os.path.join(gfg_folder, problem_name)
    solution_target = os.path.join(target_folder, "solution.py")
    readme_target = os.path.join(target_folder, "readme.md")

    # Ensure target folder exists
    os.makedirs(target_folder, exist_ok=True)

    # Check and move files
    solution_path = os.path.join(download_folder, solution_file)
    readme_path = os.path.join(download_folder, readme_file)

    if not os.path.exists(solution_path) or not os.path.exists(readme_path):
        return jsonify({"error": "Required files are missing in the downloads folder"}), 404

    shutil.move(solution_path, solution_target)
    shutil.move(readme_path, readme_target)

    # Perform Git operations
    try:
        os.chdir(target_folder)  # Change directory to the target folder

        # Add, commit, and push the solution file
        subprocess.run(["git", "add", "solution.py"], check=True)
        subprocess.run(["git", "commit", "-m", "added solution"], check=True)

        # Add, commit, and push the readme file
        subprocess.run(["git", "add", "readme.md"], check=True)
        subprocess.run(["git", "commit", "-m", "added question"], check=True)

        # Push changes
        subprocess.run(["git", "push"], check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": "Git operation failed", "details": str(e)})
    finally:
        os.chdir("../../")  # Ensure we return to the original directory

    return jsonify({"message": "Files moved, renamed, and pushed successfully"})

if __name__ == "__main__":
    app.run(debug=True)
