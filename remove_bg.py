import sys
import os
from PIL import Image

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            r, g, b, a = item
            # The alpha should be based on the brightness.
            # Using max(R,G,B) as an alpha mask is a great way to extract glow from black.
            alpha = max(r, g, b)
            if alpha == 0:
                newData.append((0, 0, 0, 0))
            else:
                # Un-premultiply the colors so they retain their golden hue
                new_r = min(255, int(r * 255 / alpha))
                new_g = min(255, int(g * 255 / alpha))
                new_b = min(255, int(b * 255 / alpha))
                newData.append((new_r, new_g, new_b, alpha))
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Failed processing {input_path}: {e}")

if __name__ == "__main__":
    assets_dir = os.path.join("src", "assets")
    
    process_image(os.path.join(assets_dir, "b1.jpeg"), os.path.join(assets_dir, "b1.png"))
    process_image(os.path.join(assets_dir, "b2.jpeg"), os.path.join(assets_dir, "b2.png"))
    process_image(os.path.join(assets_dir, "b3.jpeg"), os.path.join(assets_dir, "b3.png"))
