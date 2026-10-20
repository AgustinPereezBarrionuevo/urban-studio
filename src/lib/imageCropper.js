
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './imageCropper.css';

export function openImageCropper(
  file,
  {
    title = 'Ajustar fotografía',
    aspectRatio = 1,
    previewWidth = 600,
  } = {},
) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);

    let cropper = null;
    let settled = false;

    const modal = document.createElement('div');
    modal.className = 'image-cropper-backdrop';

    modal.innerHTML = `
      <section class="image-cropper-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-cropper-title">

        <header class="image-cropper-header">
          <div>
            <h2 id="image-cropper-title"></h2>
            <p>Arrastrá la imagen y utilizá el zoom para ajustar el encuadre.</p>
          </div>

          <button type="button" class="image-cropper-close"
            data-crop-action="cancel" aria-label="Cancelar">×</button>
        </header>

        <div class="image-cropper-stage">
          <img class="image-cropper-source" alt="Fotografía para ajustar" />
        </div>

        <div class="image-cropper-tools">
          <button type="button" data-crop-action="zoom-out">− Alejar</button>
          <button type="button" data-crop-action="zoom-in">+ Acercar</button>
          <button type="button" data-crop-action="reset">Restablecer</button>
        </div>

        <p class="image-cropper-hint">
          Podés mover la foto con el mouse o el dedo. El marco mantiene las
          proporciones de la sección donde se publicará.
        </p>

        <footer class="image-cropper-footer">
          <button type="button" class="image-cropper-cancel"
            data-crop-action="cancel">Cancelar</button>
          <button type="button" class="image-cropper-confirm"
            data-crop-action="confirm" disabled>Aplicar encuadre</button>
        </footer>
      </section>
    `;

    const titleElement = modal.querySelector('#image-cropper-title');
    const image = modal.querySelector('.image-cropper-source');
    const confirmButton = modal.querySelector('.image-cropper-confirm');

    titleElement.textContent = title;

    function finish(result = null, error = null) {
      if (settled) return;

      settled = true;
      window.removeEventListener('keydown', handleKeyDown);

      if (cropper) {
        cropper.destroy();
        cropper = null;
      }

      URL.revokeObjectURL(objectUrl);
      modal.remove();
      document.body.classList.remove('image-cropper-open');

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        finish(null);
      }
    }

    modal.querySelectorAll('[data-crop-action="cancel"]').forEach((button) => {
      button.addEventListener('click', () => finish(null));
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        finish(null);
      }
    });

    modal.querySelector('[data-crop-action="zoom-in"]')
      .addEventListener('click', () => cropper?.zoom(0.1));

    modal.querySelector('[data-crop-action="zoom-out"]')
      .addEventListener('click', () => cropper?.zoom(-0.1));

    modal.querySelector('[data-crop-action="reset"]')
      .addEventListener('click', () => cropper?.reset());

    confirmButton.addEventListener('click', () => {
      if (!cropper || settled) return;

      const data = cropper.getData(true);

      const canvas = cropper.getCroppedCanvas({
        width: previewWidth,
        height: Math.round(previewWidth / aspectRatio),
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      if (!canvas) {
        finish(null, new Error('No se pudo generar la vista previa.'));
        return;
      }

      confirmButton.disabled = true;
      confirmButton.textContent = 'Aplicando...';

      // Esta imagen recortada se utiliza solo para la vista previa.
      // El archivo original es el que se subirá a Cloudinary.
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            finish(null, new Error('No se pudo generar la vista previa.'));
            return;
          }

          const previewUrl = URL.createObjectURL(blob);

          finish({
            x: Math.max(0, data.x),
            y: Math.max(0, data.y),
            width: Math.max(1, data.width),
            height: Math.max(1, data.height),
            previewUrl,
          });
        },
        'image/jpeg',
        0.9,
      );
    });

    image.addEventListener(
      'load',
      () => {
        try {
          cropper = new Cropper(image, {
            aspectRatio,
            viewMode: 1,
            dragMode: 'move',
            autoCropArea: 0.9,
            responsive: true,
            restore: false,
            background: false,
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
            ready() {
              confirmButton.disabled = false;
            },
          });
        } catch (error) {
          finish(null, error);
        }
      },
      { once: true },
    );

    image.addEventListener(
      'error',
      () => finish(null, new Error('No se pudo abrir la fotografía.')),
      { once: true },
    );

    window.addEventListener('keydown', handleKeyDown);

    document.body.appendChild(modal);
    document.body.classList.add('image-cropper-open');

    image.src = objectUrl;
    modal.querySelector('.image-cropper-close').focus();
  });
}
