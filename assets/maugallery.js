! function ($) {
    $.fn.mauGallery = function (options) {
        var options = $.extend($.fn.mauGallery.defaults, options),
            tagsCollection = [];
        return this.each((function () {
            $.fn.mauGallery.methods.createRowWrapper($(this)), options.lightBox && $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation), $.fn.mauGallery.listeners(options), $(this).children(".gallery-item").each((function (index) {
                $.fn.mauGallery.methods.responsiveImageItem($(this)), $.fn.mauGallery.methods.moveItemInRowWrapper($(this)), $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
                var theTag = $(this).data("gallery-tag");
                options.showTags && void 0 !== theTag && -1 === tagsCollection.indexOf(theTag) && tagsCollection.push(theTag)
            })), options.showTags && $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection), $(this).fadeIn(500)
        }))
    }, $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: !0,
        lightboxId: null,
        showTags: !0,
        tagsPosition: "bottom",
        navigation: !0
    }, $.fn.mauGallery.listeners = function (options) {
        $(".gallery-item").on("click", (function () {
            options.lightBox && "IMG" === $(this).prop("tagName") && $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId)
        })), $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag), $(".gallery").on("click", ".mg-prev", () => $.fn.mauGallery.methods.prevImage(options.lightboxId)), $(".gallery").on("click", ".mg-next", () => $.fn.mauGallery.methods.nextImage(options.lightboxId))
    }, $.fn.mauGallery.methods = {
        createRowWrapper(element) {
            element.children().first().hasClass("row") || element.append('<div class="gallery-items-row row"></div>')
        },
        wrapItemInColumn(element, columns) {
            if (columns.constructor === Number) element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12/columns)}'></div>`);
            else if (columns.constructor === Object) {
                var columnClasses = "";
                columns.xs && (columnClasses += " col-" + Math.ceil(12 / columns.xs)), columns.sm && (columnClasses += " col-sm-" + Math.ceil(12 / columns.sm)), columns.md && (columnClasses += " col-md-" + Math.ceil(12 / columns.md)), columns.lg && (columnClasses += " col-lg-" + Math.ceil(12 / columns.lg)), columns.xl && (columnClasses += " col-xl-" + Math.ceil(12 / columns.xl)), element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`)
            } else console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`)
        },
        moveItemInRowWrapper(element) {
            element.appendTo(".gallery-items-row")
        },
        responsiveImageItem(element) {
            "IMG" === element.prop("tagName") && element.addClass("img-fluid")
        },
        openLightBox(element, lightboxId) {
            $("#" + lightboxId).find(".lightboxImage").attr("src", element.attr("src")), $("#" + lightboxId).modal("toggle")
        },
        prevImage() {
            let activeImage = null;
            $("img.gallery-item").each((function () {
                $(this).attr("src") === $(".lightboxImage").attr("src") && (activeImage = $(this))
            }));
            let activeTag = $(".tags-bar span.active-tag").data("images-toggle"),
                imagesCollection = [];
            "all" === activeTag ? $(".item-column").each((function () {
                $(this).children("img").length && imagesCollection.push($(this).children("img"))
            })) : $(".item-column").each((function () {
                $(this).children("img").data("gallery-tag") === activeTag && imagesCollection.push($(this).children("img"))
            }));
            let index = 0,
                next = null;
            $(imagesCollection).each((function (i) {
                $(activeImage).attr("src") === $(this).attr("src") && (index = i - 1)
            })), next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1], $(".lightboxImage").attr("src", $(next).attr("src"))
        },
        nextImage() {
            let activeImage = null;
            $("img.gallery-item").each((function () {
                $(this).attr("src") === $(".lightboxImage").attr("src") && (activeImage = $(this))
            }));
            let activeTag = $(".tags-bar span.active-tag").data("images-toggle"),
                imagesCollection = [];
            "all" === activeTag ? $(".item-column").each((function () {
                $(this).children("img").length && imagesCollection.push($(this).children("img"))
            })) : $(".item-column").each((function () {
                $(this).children("img").data("gallery-tag") === activeTag && imagesCollection.push($(this).children("img"))
            }));
            let index = 0,
                next = null;
            $(imagesCollection).each((function (i) {
                $(activeImage).attr("src") === $(this).attr("src") && (index = i + 1)
            })), next = imagesCollection[index] || imagesCollection[0], $(".lightboxImage").attr("src", $(next).attr("src"))
        },
        createLightBox(gallery, lightboxId, navigation) {
            gallery.append(`<div class="modal fade" id="${lightboxId||"galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">\n                <div class="modal-dialog" role="document">\n                    <div class="modal-content">\n                        <div class="modal-body">\n                            ${navigation?'<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>':'<span style="display:none;" />'}\n                            <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>\n                            ${navigation?'<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>':'<span style="display:none;" />'}\n                        </div>\n                    </div>\n                </div>\n            </div>`)
        },
        showItemTags(gallery, position, tags) {
            var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
            $.each(tags, (function (index, value) {
                tagItems += `<li class="nav-item active active-tag">\n                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`
            }));
            var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;
            "bottom" === position ? gallery.append(tagsRow) : "top" === position ? gallery.prepend(tagsRow) : console.error("Unknown tags position: " + position)
        },
        filterByTag() {
            if (!$(this).hasClass("active-tag")) {
                $(".active.active-tag").removeClass("active active-tag"), $(this).addClass("active-tag active");
                var tag = $(this).data("images-toggle");
                $(".gallery-item").each((function () {
                    $(this).parents(".item-column").hide(), ("all" === tag || $(this).data("gallery-tag") === tag) && $(this).parents(".item-column").show(300)
                }))
            }
        }
    }
}(jQuery);